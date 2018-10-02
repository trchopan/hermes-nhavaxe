import { BannerModule } from './banner.module';

describe('BannerModule', () => {
  let bannerModule: BannerModule;

  beforeEach(() => {
    bannerModule = new BannerModule();
  });

  it('should create an instance', () => {
    expect(bannerModule).toBeTruthy();
  });
});
