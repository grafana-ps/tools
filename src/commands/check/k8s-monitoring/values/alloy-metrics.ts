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

export default class CheckK8sMonitoringValuesAlloyMetrics extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .alloy-metrics'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesAlloyMetrics)

    const {file} = args

    this.log(`Validating .alloy-metrics for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('alloy-metrics'))) {
      this.error('Missing .alloy-metrics')
    }

    if (!isMap(v.get('alloy-metrics'))) {
      this.error('.alloy-metrics must be a map')
    }

    const enabled = v.getIn(['alloy-metrics', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.alloy-metrics.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.alloy-metrics is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.alloy-metrics is enabled`))

    this.log(em(`:heavy_check_mark:.alloy-metrics is valid`))
    this.log()
  }
}
