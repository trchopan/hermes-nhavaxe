import { SpecialsModule } from './specials.module';

describe('SpecialsModule', () => {
  let specialsModule: SpecialsModule;

  beforeEach(() => {
    specialsModule = new SpecialsModule();
  });

  it('should create an instance', () => {
    expect(specialsModule).toBeTruthy();
  });
});
