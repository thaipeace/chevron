import { SortArrayPipe } from './sort-array.pipe';

describe('varianceChecking', () => {
  it('create an instance', () => {
    const pipe = new SortArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
