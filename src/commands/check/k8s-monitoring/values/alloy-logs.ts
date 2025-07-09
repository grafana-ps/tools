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

export default class CheckK8sMonitoringValuesAlloyLogs extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .alloy-logs'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesAlloyLogs)

    const {file} = args

    this.log(`Validating .alloy-logs for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('alloy-logs'))) {
      this.error('Missing .alloy-logs')
    }

    if (!isMap(v.get('alloy-logs'))) {
      this.error('.alloy-logs must be a map')
    }

    const enabled = v.getIn(['alloy-logs', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.alloy-logs.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.alloy-logs is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.alloy-logs is enabled`))

    this.log(em(`:heavy_check_mark:.alloy-logs is valid`))
    this.log()
  }
}
