import { LeagueTextPipe } from '@editor/app/shared/pipes/league-text.pipe';

describe('LeagueTextPipe', () => {
  it('create an instance', () => {
    const pipe = new LeagueTextPipe();
    expect(pipe).toBeTruthy();
  });
});
