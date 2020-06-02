import { SortArrayPipe } from './sort-array.pipe';

describe('checkInArray', () => {
  it('create an instance', () => {
    const pipe = new SortArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
