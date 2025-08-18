import {
  Args,
  Command,
  Flags,
} from '@oclif/core'
import _ from 'lodash'
import fs from 'node:fs'
import ora from 'ora'

import {
  generate,
} from '../../../templates/k8s-monitoring/values.js'
import {
  getInstance,
} from '../../../util.js'

export default class GenerateK8sMonitoringValues extends Command {
  /* eslint-disable perfectionist/sort-objects */
  static override args = {
    slug: Args.string({
      description: 'stack slug to use',
      required: true,
    }),
    writeTokenFile: Args.string({
      description: 'write token file destination',
      required: true,
    }),
    file: Args.string({
      description: 'write destination',
      required: true,
    }),
  }
  /* eslint-enable perfectionist/sort-objects */
  static override description = 'full generation of values.yaml'
  static override flags = {
    stackToken: Flags.string({
      description: 'token with stack access',
      required: true,
    }),
  }

  public async generateValues(
    slug: string,
    token: string,
    writeToken: string,
  ) {
    const spinner = ora('Generating values...').start()

    const data = await getInstance(
      slug,
      token,
    )

    const {
      code,
      instance,
      message,
    } = data

    if (code === 'NotFound') {
      const e = `stack slug is invalid: ${message}`
      spinner.fail(e)
      this.error(e)
    }

    if (code === `InvalidCredentials`) {
      const e = `token is invalid: ${message}`
      spinner.fail(e)
      this.error(e)
    }

    const values = generate(instance, writeToken)

    spinner.succeed(`Generated values: ${values}`)

    return values
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(GenerateK8sMonitoringValues)

    const {
      file,
      slug,
      writeTokenFile,
    } = args
    const {
      stackToken,
    } = flags

    const token = _.trim(fs.readFileSync(stackToken, 'utf8'))

    if (_.isEmpty(token)) {
      this.error('stack token is empty')
    }

    const writeToken = _.trim(fs.readFileSync(writeTokenFile, 'utf8'))

    if (_.isEmpty(writeToken)) {
      this.error('write token is empty')
    }

    const values = await this.generateValues(
      slug,
      token,
      writeToken,
    )

    this.writeValues(file, values)
  }

  public writeValues(
    file: string,
    values: string,
  ) {
    const spinner = ora('Writing values to file...').start()

    try {
      fs.writeFileSync(file, values)
    } catch (error) {
      const e = `Failed to write values to file: ${error}`
      spinner.fail(e)
      this.error(e)
    }

    spinner.succeed(`Wrote values to file: ${file}`)
  }
}
