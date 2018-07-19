import { PublishAtParserPipe } from '@app/app/pipes/publish-at-parser.pipe';

describe('PublishAtParserPipe', () => {
  it('create an instance', () => {
    const pipe = new PublishAtParserPipe();
    expect(pipe).toBeTruthy();
  });
});
