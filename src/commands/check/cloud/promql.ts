import {
  Args,
  Command,
  Flags,
} from '@oclif/core'
import _ from 'lodash'
import {
  emojify as em
} from 'node-emoji'
import fs from 'node:fs'
import ora from 'ora'

import {
  collectMetrics,
  getInstance,
  readMetrics,
} from '../../../util.js'

export default class CheckCloudPromQLRead extends Command {
  static override args = {
    slug: Args.string({
      description: 'stack slug to use',
      required: true,
    }),
    fileToken: Args.string({
      description: 'token file to read',
      required: true,
    }),
    fileQuery: Args.string({
      description: 'query file to check',
      required: true
    }),
  }
  static override description = 'validate token read access'
  static override flags = {
    aggregations: Flags.string({
      default: [],
      delimiter: ',',
      description: 'aggregations to check',
      multiple: true,
      required: false,
    }),
    functions: Flags.string({
      default: [],
      delimiter: ',',
      description: 'functions to check',
      multiple: true,
      required: false,
    }),
    labels: Flags.string({
      default: [],
      delimiter: ',',
      description: 'labels to check',
      multiple: true,
      required: false,
    }),
    names: Flags.string({
      default: [],
      delimiter: ',',
      description: 'metric names to check',
      multiple: true,
      required: true,
    }),
    stackToken: Flags.string({
      description: 'token with stack access',
      required: false,
    }),
    strict: Flags.boolean({
      default: false,
      description: 'strict label check',
      required: false,
    })
  }

  public async getStack(
    slug: string,
    token: string,
  ) {
    const spinner = ora('Fetching stack details...').start()

    const data = await getInstance(
      slug,
      token,
    )

    const {
      code,
      instance,
      message,
    } = data

    if (code === 'NotFound') {
      const e = `stack slug is invalid: ${message}`
      spinner.fail(e)
      this.error(e)
    }

    if (code === 'InvalidCredentials') {
      const e = `token is invalid: ${message}`
      spinner.fail(e)
      this.error(e)
    }

    spinner.succeed(`Found stack details.`)

    return instance
  }

  public async readMetrics(
    username: string,
    password: string,
    url: string,
    query: string,
  ) {
    const spinner = ora(`Reading metrics [${url}] u:${username}...`).start()

    const data = await readMetrics(
      username,
      password,
      `${url}/api/prom/api/v1`,
      query,
    )

    spinner.succeed(`Read metrics.`)

    return data
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckCloudPromQLRead)

    const {
      fileQuery,
      fileToken,
      slug,
    } = args
    const {
      aggregations,
      functions,
      labels,
      names,
      stackToken,
      strict,
    } = flags

    this.log(`Validating PromQL`)

    const token = fs.readFileSync(fileToken, 'utf8')

    if (_.isEmpty(token)) {
      this.error('token is empty')
    }

    if (_.isEmpty(stackToken)) {
      this.error('TODO: add access without stack token')
    }

    const query = fs.readFileSync(fileQuery, 'utf8')

    if (_.isEmpty(query)) {
      this.error('query is empty')
    }

    const instance = await this.getStack(
      slug,
      fs.readFileSync(stackToken, 'utf8'),
    )

    const metrics = await this.readMetrics(
      _.get(instance, 'prometheus.id'),
      token,
      _.get(instance, 'prometheus.url'),
      query,
    )

    await this.validateMetrics({
      aggregations,
      functions,
      labels,
      metrics,
      names,
      query: query.replaceAll(/(\n|\r)/g, ' '),
      strict,
    })

    this.log(em(`:heavy_check_mark:PromQL is valid`))
    this.log()
  }

  public async validateMetrics({
    aggregations,
    functions,
    labels,
    metrics,
    names,
    query,
    strict,
  }) {
    const collection = collectMetrics(metrics)

    if (aggregations.length > 0) {
      const spinner = ora(`Verifying aggregations...`).start()

      for (const a of aggregations) {
        const r = new RegExp(`${a}[a-zA-Z0-9\\s]*?\\(.*\\)`)

        if (r.test(query)) {
          continue
        }

        spinner.fail(`Aggregation ${a}() is missing.`)
        this.error(`Aggregation ${a}() is missing.`)
      }

      spinner.succeed(`Verified aggregations.`)
    }

    if (functions.length > 0) {
      const spinner = ora(`Verifying functions...`).start()

      for (const f of functions) {
        const r = new RegExp(`${f}.*?\\(.*\\)`)

        if (r.test(query)) {
          continue
        }

        spinner.fail(`Function ${f}() is missing.`)
        this.error(`Function ${f}() is missing.`)
      }

      spinner.succeed(`Verified functions.`)
    }

    let without = _.reject(collection, ['name', undefined])

    if (without.length === 0) {
      const spinner = ora(`Calculation detected, checking query...`).start()

      const q = query
        .replaceAll(' ', '')
        .matchAll(/([a-zA-Z0-9_]*?){/g)

      const n = [...q].map((m) => m[1])

      const missing = _.difference(names, n)
      if (missing.length > 0) {
        spinner.fail(`Calculation query is invalid.`)
        this.error(`Calculation query is invalid. Missing metrics: \n${JSON.stringify(missing)}`)
      }

      const unexpected = _.difference(n, names)
      if (unexpected.length > 0) {
        spinner.fail(`Calculation query is invalid.`)
        this.error(`Calculation query is invalid. Unexpected metrics: \n${JSON.stringify(unexpected)}`)
      }

      spinner.succeed(`Calculation query is valid.`)
    } else {
      for (const n of names) {
        const spinner = ora(`Verifying ${n}{} series...`).start()

        if (!_.some(collection , ['name', n])) {
          spinner.fail(`${n}{} series not found.`)
          this.error(`${n}{} series not found.`)
        }

        spinner.succeed(`Verified ${n}{} series.`)

        without = _.reject(without, ['name', n])
      }

      if (without.length > 0) {
        this.error(
          `Unexpected metrics found: ${JSON.stringify(without)}`
        )
      }

      if (labels.length === 0) {
        return
      }
    }

    const ln = labels.map((l) => _.first(l.split('=')))

    if (strict) {
      for (const c of collection) {
        const k = _.keys(_.omit(c, ['name', 'timestamp', 'value']))

        const diff = _.difference(k, ln)

        if (diff.length === 0) {
          continue
        }

        this.error(
          `Unexpected labels found: ${JSON.stringify(diff)}`
        )
      }
    }

    for (const l of labels) {
      const [
        label,
        regex,
      ]  = l.split('=')
      const r = new RegExp(_.trim(regex, " \"'"))

      const spinner = ora(`Verifying "${label}" label... ${r}`).start()

      if (!_.some(collection , label)) {
        spinner.fail(`"${label}" label not found.`)
        this.error(`"${label}" label not found.`)
      }

      const s = _.filter(collection, label)
      const unmatch = _.find(s, (i) => !r.test(_.get(i, label)))
      if (unmatch) {
        const ex = JSON.stringify(unmatch, null, 2)
        spinner.fail(`"${label}" label does not match ${r}.`)
        this.error(`"${label}" label does not match ${r}. \n${ex}`)
      }

      spinner.succeed(`Verified "${label}" label. ${r}`)
    }
  }
}
