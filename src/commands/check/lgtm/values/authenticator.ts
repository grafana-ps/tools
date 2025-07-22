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
import {
  isMap,
  isNode,
  parseDocument,
} from 'yaml'

export default class CheckLgtmValuesAuthenticator extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .authenticator'
  static override flags = {
    telemetry: Flags.string({
      char: 't',
      default: ['prometheus', 'otlp'],
      delimiter: ',',
      description: 'types of telmetry to validate',
      multiple: true,
      options: [
        'prometheus',
        'otlp',
      ],
      required: false,
    }),
  }

  public checkPrometheus(n) {
    const pa = n.get('podAnnotations')

    if (!isNode(pa)) {
      this.error('Missing .authenticator.podAnnotations')
    }

    if (!isMap(pa)) {
      this.error('.authenticator.podAnnotations must be a map')
    }

    if (!pa.has('k8s.grafana.com/scrape')) {
      this.error('.authenticator.podAnnotations["k8s.grafana.com/scrape"] is missing')
    }

    const scrape = pa.get('k8s.grafana.com/scrape')

    if (!_.isString(scrape)) {
      this.error('.authenticator.podAnnotations["k8s.grafana.com/scrape"] must be a string')
    }

    if (scrape !== "true") {
      this.error('.authenticator.podAnnotations["k8s.grafana.com/scrape"] is not "true"') 
    }
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckLgtmValuesAuthenticator)

    const {file} = args
    const {telemetry} = flags

    this.log(`Validating .authenticator for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    const n = v.get('authenticator')

    if (!isNode(n)) {
      this.error('Missing .authenticator')
    }

    if (!isMap(n)) {
      this.error('.authenticator must be a map')
    }

    if (v.hasIn(['authenticator', 'enabled'])) {
      const enabled = v.getIn(['authenticator', 'enabled'])

      if (!_.isBoolean(enabled)) {
        this.error('.authenticator.enabled must be a boolean')
      }

      if (enabled !== true) {
        this.error('.authenticator is not enabled') 
      }
    }

    this.log(em(`:heavy_check_mark:.authenticator is enabled`))

    if (telemetry.includes('prometheus')) {
      this.checkPrometheus(n)
    }

    this.log(em(`:heavy_check_mark:.authenticator is valid`))
    this.log()
  }
}
