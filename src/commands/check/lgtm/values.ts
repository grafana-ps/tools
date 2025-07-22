import {
  Args,
  Command,
  Flags,
} from '@oclif/core'

export default class CheckLgtmValues extends Command {
  static override args = {
    file: Args.string({
      description: 'values file to validate',
      required: true,
    }),
  }
  static override description = 'full validation of values.yaml'
  static override flags = {
    telemetry: Flags.string({
      char: 't',
      default: ['prometheus', 'otlp'],
      delimiter: ',',
      description: 'types of telmetry to validate',
      multiple: true,
      options: [
        'prometheus',
        'otlp',
      ],
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckLgtmValues)

    const {file} = args
    const {telemetry} = flags

    if (telemetry.includes('prometheus')) {
      await this.config.runCommand('check:lgtm:values:api', [
        file,
        `-t ${telemetry.join(',')}`,
      ])
      await this.config.runCommand('check:lgtm:values:authenticator', [
        file,
        `-t ${telemetry.join(',')}`,
      ])
      await this.config.runCommand('check:lgtm:values:loadGenerator', [
        file,
        `-t ${telemetry.join(',')}`,
      ])
    }

    if (telemetry.includes('otlp')) {
      await this.config.runCommand('check:lgtm:values:opentelemetry', [file])
    }
  }
}
