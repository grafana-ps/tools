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

export default class CheckK8sMonitoringValuesAlloySingleton extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .alloy-singleton'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesAlloySingleton)

    const {file} = args

    this.log(`Validating .alloy-singleton for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('alloy-singleton'))) {
      this.error('Missing .alloy-singleton')
    }

    if (!isMap(v.get('alloy-singleton'))) {
      this.error('.alloy-singleton must be a map')
    }

    const enabled = v.getIn(['alloy-singleton', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.alloy-singleton.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.alloy-singleton is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.alloy-singleton is enabled`))

    this.log(em(`:heavy_check_mark:.alloy-singleton is valid`))
    this.log()
  }
}
