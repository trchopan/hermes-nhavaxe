import { SharedModule } from '@editor/app/shared/shared.module';

describe('SharedModule', () => {
  let sharedModule: SharedModule;

  beforeEach(() => {
    sharedModule = new SharedModule();
  });

  it('should create an instance', () => {
    expect(sharedModule).toBeTruthy();
  });
});
