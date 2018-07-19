import { TrimTextPipe } from '@app/app/pipes/trim-text.pipe';

describe('TrimTextPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimTextPipe();
    expect(pipe).toBeTruthy();
  });
});
