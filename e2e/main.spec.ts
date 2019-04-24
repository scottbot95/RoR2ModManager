import { expect, assert } from 'chai';
import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';

describe('ror2-mod-manager App', function() {
  commonSetup.apply(this);

  let browser: any;
  let client: SpectronClient;

  beforeEach(function() {
    client = this.app.client;
    browser = client as any;
  });

  xit('should display message saying App works !', async function() {
    const text = await browser.getText('app-home h1');
    expect(text).to.equal('App works !');
  });

  it('creates initial windows', async function() {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });
});
