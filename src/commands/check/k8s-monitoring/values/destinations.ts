import {
  Args,
  Command,
  Flags,
} from '@oclif/core'
import _ from 'lodash'
import * as emoji from 'node-emoji'
import fs from 'node:fs'
import {
  pushMetrics,
} from 'prometheus-remote-write'
import {
  isNode,
  isSeq,
  parseDocument,
} from 'yaml'

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
      default: ['prometheus','loki','tempo'],
      delimiter: ',',
      description: 'types of destinations to validate',
      multiple: true,
      options: [
        'prometheus',
        'loki',
        'tempo',
      ],
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckK8sMonitoringValuesDestinations)

    const {file} = args
    const {types} = flags

    this.log(emoji.emojify(`:white_circle: Validating .destinations for ${file}`))

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
      this.log(emoji.emojify(`\n:white_circle: Checking for ${type} destinations:`))
      const found = destinations.toJSON().filter((d: any) => d.type === type)

      if (found.length === 0) {
        this.error(`Missing ${type} destination`)
      }

      for await (const d of found) {
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

        if (!_.isString(username)) {
          this.error(`${prefix} Missing auth.username`)
        }

        const password = _.get(d, 'auth.password')

        if (!_.isString(password)) {
          this.error(`${prefix} Missing auth.password`)
        }

        this.log(emoji.emojify(`heavy_check_mark: ${prefix} Destination is valid`))
        this.log(emoji.emojify(`:white_circle: ${prefix} Testing connection to Grafana Cloud...`))

        try {
          if (type === 'prometheus') {
            const response = await pushMetrics({
              'grot_check': 1,
            }, {
              auth: {
                password,
                username,
              },
              url,
            })

            if (response.errorMessage) {
              throw new Error(`${response.statusText} ${response.status} ${response.errorMessage}`)
            }
          }

          if (type === 'loki') {
            const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
            const headers = {
              'Authorization': basicAuth,
              'Content-Type': 'application/json',
            }

            const body = JSON.stringify({
              streams: [{
                stream: {
                  'grot_check': 'true',
                },
                values: [
                  [`${Date.now() * 1000 * 1000}`, 'never wield such power, you forget to be polite'],
                ]
              }]
            })

            const response = await fetch(url, {
              body,
              headers,
              method: 'POST',
            })

            if (!response.ok) {
              throw new Error(`${response.statusText} ${response.status}`)
            }
          }
        } catch (error: any) {
          this.error(`${prefix} Connection to Grafana Cloud failed: \n\n${error}`)
        }

        this.log(emoji.emojify(`:white_check_mark: ${prefix} Connection to Grafana Cloud successful`))
      }
    }
  }
}
