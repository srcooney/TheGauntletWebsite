import { TheGauntletWebsitePage } from './app.po';

describe('the-gauntlet-website App', function() {
  let page: TheGauntletWebsitePage;

  beforeEach(() => {
    page = new TheGauntletWebsitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
