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

export default class CheckK8sMonitoringValuesClusterEvents extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .clusterEvents'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesClusterEvents)

    const {file} = args

    this.log(`Validating .clusterEvents for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('clusterEvents'))) {
      this.error('Missing .clusterEvents')
    }

    if (!isMap(v.get('clusterEvents'))) {
      this.error('.clusterEvents must be a map')
    }

    const enabled = v.getIn(['clusterEvents', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.clusterEvents.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.clusterEvents is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.clusterEvents is enabled`))

    this.log(em(`:heavy_check_mark:.clusterEvents is valid`))
    this.log()
  }
}
