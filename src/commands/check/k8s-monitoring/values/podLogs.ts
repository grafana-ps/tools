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

export default class CheckK8sMonitoringValuesPodLogs extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .podLogs'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesPodLogs)

    const {file} = args

    this.log(`Validating .podLogs for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('podLogs'))) {
      this.error('Missing .podLogs')
    }

    if (!isMap(v.get('podLogs'))) {
      this.error('.podLogs must be a map')
    }

    const enabled = v.getIn(['podLogs', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.podLogs.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.podLogs is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.podLogs is enabled`))

    this.log(em(`:heavy_check_mark:.podLogs is valid`))
    this.log()
  }
}
