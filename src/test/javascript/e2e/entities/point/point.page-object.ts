import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import PointUpdatePage from './point-update.page-object';

const expect = chai.expect;
export class PointDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('specialistSchedulerApp.point.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-point'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class PointComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('point-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('point');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreatePoint() {
    await this.createButton.click();
    return new PointUpdatePage();
  }

  async deletePoint() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const pointDeleteDialog = new PointDeleteDialog();
    await waitUntilDisplayed(pointDeleteDialog.deleteModal);
    expect(await pointDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/specialistSchedulerApp.point.delete.question/);
    await pointDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(pointDeleteDialog.deleteModal);

    expect(await isVisible(pointDeleteDialog.deleteModal)).to.be.false;
  }
}
