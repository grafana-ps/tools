import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('check:k8s-monitoring:values:alloy-metrics', () => {
  it('runs check:k8s-monitoring:values:alloy-metrics cmd', async () => {
    const {stdout} = await runCommand('check:k8s-monitoring:values:alloy-metrics')
    expect(stdout).to.contain('hello world')
  })

  it('runs check:k8s-monitoring:values:alloy-metrics --name oclif', async () => {
    const {stdout} = await runCommand('check:k8s-monitoring:values:alloy-metrics --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
