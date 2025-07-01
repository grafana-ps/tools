import { runCommand } from '@oclif/test';
import { expect } from 'chai';
describe('check:k8s-monitoring:cluster', () => {
    it('runs check:k8s-monitoring:cluster cmd', async () => {
        const { stdout } = await runCommand('check:k8s-monitoring:cluster');
        expect(stdout).to.contain('hello world');
    });
    it('runs check:k8s-monitoring:cluster --name oclif', async () => {
        const { stdout } = await runCommand('check:k8s-monitoring:cluster --name oclif');
        expect(stdout).to.contain('hello oclif');
    });
});
