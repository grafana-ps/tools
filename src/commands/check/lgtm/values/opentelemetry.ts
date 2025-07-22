import {
  Args,
  Command,
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

export default class CheckLgtmValuesOpentelemetry extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .opentelemetry'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckLgtmValuesOpentelemetry)

    const {file} = args

    this.log(`Validating .opentelemetry for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    const n = v.get('opentelemetry')

    if (!isNode(n)) {
      this.error('Missing .opentelemetry')
    }

    if (!isMap(n)) {
      this.error('.opentelemetry must be a map')
    }

    const url = n.get('url')

    if (!_.isString(url)) {
      this.error('.opentelemetry.url must be a string')
    }

    this.log(em(`:heavy_check_mark:.opentelemetry is valid`))
    this.log()
  }
}
