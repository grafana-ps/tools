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

export default class CheckK8sMonitoringCluster extends Command {
  static override args = {
    file: Args.string({
      description: 'values file to validate',
      required: true,
    }),
  }
  static override description = 'validate .cluster'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringCluster)

    const {file} = args

    this.log(`Validating .cluster for ${file}`)

    const v = parseDocument(fs.readFileSync(file, 'utf8'))

    if (v.errors.length > 0) {
      this.error(`Not a valid yaml file: \n\n${v.errors}`)
    }

    if (!isNode(v.get('cluster'))) {
      this.error('Missing .cluster')
    }

    if (!isMap(v.get('cluster'))) {
      this.error('.cluster must be a map')
    }

    if (!_.isString(v.getIn(['cluster', 'name']))) {
      this.error('.cluster.name must be a string')
    }

    this.log(em(`:heavy_check_mark:.cluster.name is valid`))

    this.log(em(`:heavy_check_mark:.cluster is valid`))
    this.log()
  }
}
