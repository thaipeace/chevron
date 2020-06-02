import { XmlToJsonPipe } from './xml-to-json.pipe';

describe('XmlToJsonPipe', () => {
  it('create an instance', () => {
    const pipe = new XmlToJsonPipe();
    expect(pipe).toBeTruthy();
  });
});
