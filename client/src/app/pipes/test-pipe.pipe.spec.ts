import { TestPipePipe } from './test-pipe.pipe';

describe('TestPipePipe', () => {
  it('create an instance', () => {
    const pipe = new TestPipePipe();
    expect(pipe).toBeTruthy();
  });
});
