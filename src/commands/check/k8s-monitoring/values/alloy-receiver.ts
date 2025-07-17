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

export default class CheckK8sMonitoringValuesAlloyReceiver extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .alloy-receiver'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesAlloyReceiver)

    const {file} = args

    this.log(`Validating .alloy-receiver for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('alloy-receiver'))) {
      this.error('Missing .alloy-receiver')
    }

    if (!isMap(v.get('alloy-receiver'))) {
      this.error('.alloy-receiver must be a map')
    }

    const enabled = v.getIn(['alloy-receiver', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.alloy-receiver.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.alloy-receiver is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.alloy-receiver is enabled`))

    this.log(em(`:heavy_check_mark:.alloy-receiver is valid`))
    this.log()
  }
}
