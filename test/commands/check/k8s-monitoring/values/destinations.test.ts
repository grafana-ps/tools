import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('check:k8s-monitoring:values:destinations', () => {
  it('runs check:k8s-monitoring:values:destinations cmd', async () => {
    const {stdout} = await runCommand('check:k8s-monitoring:values:destinations')
    expect(stdout).to.contain('hello world')
  })

  it('runs check:k8s-monitoring:values:destinations --name oclif', async () => {
    const {stdout} = await runCommand('check:k8s-monitoring:values:destinations --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
