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
  isNode,
  isSeq,
  parseDocument,
} from 'yaml'

import {
  writeLog,
  writeMetric,
  writeTrace,
} from '../../../../util.js'

export default class CheckK8sMonitoringValuesDestinations extends Command {
  static override args = {
    file: Args.string({
      description: 'values file to validate',
      required: true,
    }),
  }
  static override description = 'validate .destinations'
  static override flags = {
    types: Flags.string({
      char: 't',
      default: ['prometheus','loki','otlp'],
      delimiter: ',',
      description: 'types of destinations to validate',
      multiple: true,
      options: [
        'prometheus',
        'loki',
        'otlp',
      ],
      required: false,
    }),
  }

  public async checkDestination(d): Promise<void> {
    const type = _.get(d, 'type')
    const name = _.get(d, 'name')

    if (!_.isString(name)) {
      this.error(`${type}: Missing name`)
    }

    const prefix = `${type}: ${name}:`
    const url = _.get(d, 'url')

    if (!_.isString(url)) {
      this.error(`${prefix} Missing url`)
    }

    const authType = _.get(d, 'auth.type')

    if (!_.isString(authType)) {
      this.error(`${prefix} Missing auth.type`)
    }

    if (authType !== 'basic') {
      this.error(`${prefix} auth.type must be basic`) 
    }

    const username = _.get(d, 'auth.username')

    if (_.isUndefined(username)) {
      this.error(`${prefix} Missing auth.username`)
    }

    if (!_.isString(username)) {
      this.error(`${prefix} auth.username must be a string`)
    }

    const password = _.get(d, 'auth.password')

    if (!_.isString(password)) {
      this.error(`${prefix} Missing auth.password`)
    }

    if (type === 'otlp') {
       this.checkOtlp(d)
    }

    this.log(em(`:heavy_check_mark:${prefix} Destination is valid`))
    const spinner = ora(`${prefix} Testing write to Grafana Cloud...`).start()

    try {
      if (type === 'prometheus') {
        await writeMetric(username, password, url)
      }

      if (type === 'loki') {
        await writeLog(username, password, url)
      }

      if (type === 'otlp') {
        await writeTrace(username, password, url)
      }
    } catch (error) {
      spinner.fail(`${prefix} Test write to Grafana Cloud failed: \n\n${error}`)
      this.error(`${prefix} Test write to Grafana Cloud failed: \n\n${error}`)
    }

    spinner.succeed(`${prefix} Test write to Grafana Cloud successful`)
    this.log()
  }

  public checkOtlp(d): void {
    const prefix = `otlp: ${_.get(d, 'name')}:`
    const isGrafanaCloud = _.get(d, 'url').includes('grafana.net')

    if (isGrafanaCloud) {
      if (!_.has(d, 'protocol')) {
        this.error(`${prefix} protocol must be explicitly set to "http" for Grafana Cloud (default: "grpc")`)
      }

      const protocol = _.get(d, 'protocol')

      if (protocol !== 'http') {
        this.error(`${prefix} protocol must be "http" for Grafana Cloud`)
      }
    }
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckK8sMonitoringValuesDestinations)

    const {file} = args
    const {types} = flags

    this.log(`Validating .destinations for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    const destinations = v.get('destinations')

    if (!isNode(destinations)) {
      this.error('Missing .destinations')
    }

    if (!isSeq(destinations)) {
      this.error('.destinations must be a sequence')
    }

    if (!types || types.length === 0) {
      this.error('At least one type must be specified')
    }

    for await (const type of types) {
      const spinner = ora(`Checking for ${type} destinations...`).start()
      const found = destinations.toJSON().filter((d) => _.get(d, 'type') === type)

      if (found.length === 0) {
        spinner.fail(`No ${type} destinations found`)
        this.error(`No ${type} destinations found`)
      }

      spinner.succeed(`Found ${found.length} ${type} destinations`)

      for await (const d of found) {
        await this.checkDestination(d)
      }
    }

    this.log(em(':heavy_check_mark:.destinations is valid'))
    this.log()
  }
}
