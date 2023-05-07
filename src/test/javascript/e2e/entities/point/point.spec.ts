import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PointComponentsPage from './point.page-object';
import PointUpdatePage from './point-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Point e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pointComponentsPage: PointComponentsPage;
  let pointUpdatePage: PointUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    pointComponentsPage = new PointComponentsPage();
    pointComponentsPage = await pointComponentsPage.goToPage(navBarPage);
  });

  it('should load Points', async () => {
    expect(await pointComponentsPage.title.getText()).to.match(/Points/);
    expect(await pointComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Points', async () => {
    const beforeRecordsCount = (await isVisible(pointComponentsPage.noRecords)) ? 0 : await getRecordsCount(pointComponentsPage.table);
    pointUpdatePage = await pointComponentsPage.goToCreatePoint();
    await pointUpdatePage.enterData();

    expect(await pointComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(pointComponentsPage.table);
    await waitUntilCount(pointComponentsPage.records, beforeRecordsCount + 1);
    expect(await pointComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await pointComponentsPage.deletePoint();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(pointComponentsPage.records, beforeRecordsCount);
      expect(await pointComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(pointComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
