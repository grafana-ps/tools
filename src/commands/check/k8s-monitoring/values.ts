import {
  Args,
  Command,
  Flags,
} from '@oclif/core'

export default class CheckK8sMonitoringValues extends Command {
  static override args = {
    file: Args.string({
      description: 'values file to validate',
      required: true,
    }),
  }
  static override description = 'full validation of values.yaml'
  static override flags = {
    types: Flags.string({
      char: 't',
      default: ['prometheus', 'loki', 'otlp'],
      delimiter: ',',
      description: 'types of destinations to validate',
      multiple: true,
      options: [
        'prometheus',
        'loki',
        'otlp',
      ],
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckK8sMonitoringValues)

    const {file} = args
    const {types} = flags

    await this.config.runCommand('check:k8s-monitoring:values:cluster', [file])
    await this.config.runCommand('check:k8s-monitoring:values:alloy-metrics', [file])
    await this.config.runCommand('check:k8s-monitoring:values:alloy-logs', [file])
    await this.config.runCommand('check:k8s-monitoring:values:alloy-singleton', [file])
    await this.config.runCommand('check:k8s-monitoring:values:clusterMetrics', [file])
    await this.config.runCommand('check:k8s-monitoring:values:clusterEvents', [file])
    await this.config.runCommand('check:k8s-monitoring:values:annotationAutodiscovery', [file])
    await this.config.runCommand('check:k8s-monitoring:values:podLogs', [file])
    await this.config.runCommand('check:k8s-monitoring:values:nodeLogs', [file])
    await this.config.runCommand('check:k8s-monitoring:values:destinations', [
      file,
      `-t ${types.join(',')}`,
    ])
  }
}
