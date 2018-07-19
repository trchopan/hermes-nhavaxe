import { LeagueImagePipe } from '@editor/app/shared/pipes/league-image.pipe';

describe('LeagueImagePipe', () => {
  it('create an instance', () => {
    const pipe = new LeagueImagePipe();
    expect(pipe).toBeTruthy();
  });
});
