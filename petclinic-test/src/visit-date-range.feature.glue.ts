import {Given, When, Then} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {ApiClient} from './support/api-client';
import {PlaywrightWorld} from './support/world';

const api = new ApiClient();

// Only the browser's clock is frozen: the form is what refuses, so the backend's real
// "today" never takes part. Its own copy of the rule is tested in VisitTest.java.
Given('today is {word}', async function (this: PlaywrightWorld, isoDate: string) {
  await this.page.clock.setFixedTime(new Date(`${isoDate}T12:00:00`));
});

Given('a pet born on {word}', async function (this: PlaywrightWorld, birthDate: string) {
  const {ownerId, petId} = await api.createOwnerWithDog(birthDate);
  this.ownerId = ownerId;
  this.petId = petId;
});

When('I book a visit for {word}', async function (this: PlaywrightWorld, isoDate: string) {
  await this.page.goto(`/pets/${this.petId}/visits/add`);
  await this.page.locator('h2:has-text("New Visit")').waitFor({state: 'visible', timeout: 10_000});
  await expect(this.page.locator('td', {hasText: 'Axel'})).toBeVisible(); // the range needs the pet
  await this.page.locator('input[name="date"]').fill(isoDate.replace(/-/g, '/'));
  await this.page.locator('input#description').fill('check-up');
});

Then('the visit is refused', async function (this: PlaywrightWorld) {
  await expect(this.page.locator('.help-block', {hasText: 'Date cannot be'})).toBeVisible();
  await expect(this.page.locator('button[type="submit"]:has-text("Add Visit")')).toBeDisabled();
  expect(await api.visitsOfPet(this.petId!)).toEqual([]);
});
