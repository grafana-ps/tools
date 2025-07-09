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

export default class CheckK8sMonitoringValuesNodeLogs extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .nodeLogs'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesNodeLogs)

    const {file} = args

    this.log(`Validating .nodeLogs for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('nodeLogs'))) {
      this.error('Missing .nodeLogs')
    }

    if (!isMap(v.get('nodeLogs'))) {
      this.error('.nodeLogs must be a map')
    }

    const enabled = v.getIn(['nodeLogs', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.nodeLogs.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.nodeLogs is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.nodeLogs is enabled`))

    this.log(em(`:heavy_check_mark:.nodeLogs is valid`))
    this.log()
  }
}
