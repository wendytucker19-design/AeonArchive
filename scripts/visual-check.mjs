import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.AEON_TEST_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /synchronously unmount|removeChild|hydration|Maximum update depth/i.test(message.text())) errors.push(message.text());
  });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();
  assert.equal(await page.locator('.artifact-card').count(), 12);
  await page.getByRole('link', { name: 'Search the collection' }).click();
  assert.equal(await page.locator('.artifact-card').count(), 12);
  await page.getByLabel('Search the collection', { exact: true }).fill('chronometer');
  assert.equal(await page.locator('.artifact-card').count(), 1);
  await page.getByRole('button', { name: 'Explore The Meridian Keeper', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'Source photograph', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.getByRole('button', { name: /The celestial study/ }).click();
  if (await page.getByRole('button', { name: '3D study', exact: true }).count()) {
    await page.getByRole('button', { name: '3D study', exact: true }).click();
    await page.locator('dialog canvas').waitFor({ state: 'visible', timeout: 20000 });
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
  }
  await page.keyboard.press('Escape');
  await page.locator('#world').scrollIntoViewIfNeeded();
  await page.locator('#world canvas').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('.world-stops').getByRole('button', { name: 'Rochester', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.world-stops button:last-child')?.getAttribute('aria-pressed') === 'true');
  await page.locator('.world-related-object').getByRole('button', { name: 'The Deco Eye', exact: true }).click();
  await page.getByRole('heading', { name: 'The Deco Eye', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded'), 'true');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflow, false, 'The mobile layout should fit the viewport.');
  assert.deepEqual(errors, [], 'Pages should load without runtime exceptions.');
  console.log('Collection, search, dialog, zoom, keyboard dismissal, mobile navigation, and overflow checks passed.');
} finally {
  await browser.close();
}
