import { VideosModule } from './videos.module';

describe('VideosModule', () => {
  let videosModule: VideosModule;

  beforeEach(() => {
    videosModule = new VideosModule();
  });

  it('should create an instance', () => {
    expect(videosModule).toBeTruthy();
  });
});
