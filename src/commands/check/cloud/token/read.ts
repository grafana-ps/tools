import {
  Args,
  Command,
  Flags,
} from '@oclif/core'
import _ from 'lodash'
import {
  emojify as em
} from 'node-emoji'
import fs from 'node:fs'
import ora from 'ora'

import {
  formatMetrics,
  getInstance,
  readMetrics,
} from '../../../../util.js'

export default class CheckCloudTokenRead extends Command {
  static override args = {
    slug: Args.string({
      description: 'stack slug to use',
      required: true,
    }),
    file: Args.string({
      description: 'file to read',
      required: true,
    }),
  }
  static override description = 'validate token read access'
  static override flags = {
    stackToken: Flags.string({
      description: 'token with stack access',
      required: false,
    }),
  }

  public async getStack(
    slug: string,
    token: string,
  ) {
    const spinner = ora('Fetching stack details...').start()

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

    if (code === 'InvalidCredentials') {
      const e = `token is invalid: ${message}`
      spinner.fail(e)
      this.error(e)
    }

    spinner.succeed(
      `Found stack details: ${JSON.stringify(instance, null, 2)}`,
    )

    return instance
  }

  public async readMetrics(
    username: string,
    password: string,
    url: string,
  ) {
    const spinner = ora(`Reading metrics [${url}] u:${username}...`).start()

    const data = await readMetrics(
      username,
      password,
      `${url}/api/prom/api/v1`,
    )

    spinner.succeed(`Read metrics: \n${formatMetrics(data)}`)
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckCloudTokenRead)

    const {
      file,
      slug,
    } = args
    const {stackToken} = flags

    this.log(`Validating token read access`)

    const token = fs.readFileSync(file, 'utf8')

    if (_.isEmpty(token)) {
      this.error('token is empty')
    }

    if (_.isEmpty(stackToken)) {
      this.error('TODO: add access without stack token')
    }

    const instance = await this.getStack(
      slug,
      fs.readFileSync(stackToken, 'utf8'),
    )

    await this.readMetrics(
      _.get(instance, 'prometheus.id'),
      token,
      _.get(instance, 'prometheus.url'),
    )

    this.log(em(`:heavy_check_mark:Token is valid`))
    this.log()
  }
}
