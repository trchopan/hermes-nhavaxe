import { PricesModule } from './prices.module';

describe('PricesModule', () => {
  let priceListModule: PricesModule;

  beforeEach(() => {
    priceListModule = new PricesModule();
  });

  it('should create an instance', () => {
    expect(priceListModule).toBeTruthy();
  });
});
