import { runCommand } from '@oclif/test';
import { expect } from 'chai';
describe('check:k8s-monitoring:values', () => {
    it('runs check:k8s-monitoring:values cmd', async () => {
        const { stdout } = await runCommand('check:k8s-monitoring:values');
        expect(stdout).to.contain('hello world');
    });
    it('runs check:k8s-monitoring:values --name oclif', async () => {
        const { stdout } = await runCommand('check:k8s-monitoring:values --name oclif');
        expect(stdout).to.contain('hello oclif');
    });
});
