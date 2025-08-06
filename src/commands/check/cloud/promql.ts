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
    file: Args.string({
      description: 'token file to read',
      required: true,
    }),
    query: Args.string({
      description: 'query to check',
      required: true
    }),
  }
  static override description = 'validate token read access'
  static override flags = {
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
      file,
      query,
      slug,
    } = args
    const {
      labels,
      names,
      stackToken,
    } = flags

    this.log(`Validating PromQL`)

    const token = fs.readFileSync(file, 'utf8')

    if (_.isEmpty(token)) {
      this.error('token is empty')
    }

    if (_.isEmpty(stackToken)) {
      this.error('TODO: add access without stack token')
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

    await this.validateMetrics(metrics, names, labels)

    this.log(em(`:heavy_check_mark:PromQL is valid`))
    this.log()
  }

  public async validateMetrics(metrics, names, labels) {
    const collection = collectMetrics(metrics)

    let without = collection

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

    for (const l of labels) {
      const spinner = ora(`Verifying "${l}" label...`).start()

      if (!_.some(collection , l)) {
        spinner.fail(`"${l}" label not found.`)
        this.error(`"${l}" label not found.`)
      }

      spinner.succeed(`Verified "${l}" label.`)
    }
  }
}
