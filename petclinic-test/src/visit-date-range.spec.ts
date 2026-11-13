import axios from 'axios';
import {test, expect} from './support/trace-fixture';
import {ApiClient} from './support/api-client';

// Issue #40, replayed step by step: Axel, born 2024-05-10, booked for 0009/07/20.
// visit-date-range.feature states the rule; this is the bug report, on both layers.

const API_BASE = process.env.API_BASE_URL || 'http://127.0.0.1:8080/api';
const api = new ApiClient(API_BASE);
const YEAR_9 = '0009-07-20';

test('The New Visit form refuses a visit dated year 9', async ({page}) => {
  const {petId} = await api.createOwnerWithDog('2024-05-10');

  await page.goto(`/pets/${petId}/visits/add`);
  await expect(page.locator('td', {hasText: 'Axel'})).toBeVisible();
  await page.locator('input[name="date"]').fill('0009/07/20');
  await page.locator('input#description').fill('ate the Christmas tinsel; kept under observation');

  await expect(page.locator('.help-block'))
    .toContainText("Date cannot be before the pet's birth date (2024-05-10)");
  await expect(page.locator('button[type="submit"]:has-text("Add Visit")')).toBeDisabled();
});

test('The API refuses a visit dated year 9', async () => {
  const {ownerId, petId} = await api.createOwnerWithDog('2024-05-10');

  const response = await axios.post(`${API_BASE}/owners/${ownerId}/pets/${petId}/visits`,
    {date: YEAR_9, description: 'ate the Christmas tinsel; kept under observation'},
    {validateStatus: () => true});

  expect(response.status).toBe(400);
  expect(response.data.detail).toContain('before the pet\'s birth date 2024-05-10');
  expect(await api.visitsOfPet(petId)).toEqual([]);
});
