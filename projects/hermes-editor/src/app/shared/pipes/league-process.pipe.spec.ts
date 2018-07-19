import { LeagueProcessPipe } from '@editor/app/shared/pipes/league-process.pipe';

describe('LeagueProcessPipe', () => {
  it('create an instance', () => {
    const pipe = new LeagueProcessPipe();
    expect(pipe).toBeTruthy();
  });
});
