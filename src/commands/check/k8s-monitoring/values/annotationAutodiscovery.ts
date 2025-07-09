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

export default class CheckK8sMonitoringValuesAnnotationAutodiscovery extends Command {
  static override args = {
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate .annotationAutodiscovery'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValuesAnnotationAutodiscovery)

    const {file} = args

    this.log(`Validating .annotationAutodiscovery for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('annotationAutodiscovery'))) {
      this.error('Missing .annotationAutodiscovery')
    }

    if (!isMap(v.get('annotationAutodiscovery'))) {
      this.error('.annotationAutodiscovery must be a map')
    }

    const enabled = v.getIn(['annotationAutodiscovery', 'enabled'])

    if (!_.isBoolean(enabled)) {
      this.error('.annotationAutodiscovery.enabled must be a boolean')
    }

    if (enabled !== true) {
      this.error('.annotationAutodiscovery is not enabled') 
    }

    this.log(em(`:heavy_check_mark:.annotationAutodiscovery is enabled`))

    this.log(em(`:heavy_check_mark:.annotationAutodiscovery is valid`))
    this.log()
  }
}
