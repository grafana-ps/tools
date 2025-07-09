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

export default class CheckK8sMonitoringValuesClusterMetrics extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .clusterMetrics'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesClusterMetrics)

    const {file} = args

    this.log(`Validating .clusterMetrics for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('clusterMetrics'))) {
      this.error('Missing .clusterMetrics')
    }

    if (!isMap(v.get('clusterMetrics'))) {
      this.error('.clusterMetrics must be a map')
    }

    const enabled = v.getIn(['clusterMetrics', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.clusterMetrics.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.clusterMetrics is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.clusterMetrics is enabled`))

    this.log(em(`:heavy_check_mark:.clusterMetrics is valid`))
    this.log()
  }
}
