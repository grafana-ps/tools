import {
  Args,
  Command,
} from '@oclif/core'

export default class CheckK8sMonitoringValues extends Command {
  static override args = {
    file: Args.string({
      description: 'values file to validate',
      required: true,
    }),
  }
  static override description = 'full validation of values.yaml'

  public async run(): Promise<void> {
    const {args} = await this.parse(CheckK8sMonitoringValues)

    const {file} = args

    this.config.runCommand('check:k8s-monitoring:values:cluster', [file])
  }
}
