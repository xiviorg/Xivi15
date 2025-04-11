import { test, expect } from '@playwright/test';

const removewelcome = async (page) => {
  await page.evaluate(() => {
    localStorage.setItem('hideWelcome', 'true');
  });
};

const waitforsplash = async (page) => {
  await page.waitForTimeout(5000);
  const viewport = page.viewportSize();
  if (viewport) {
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
  }
};

test('Check if desktop environment loads', async ({ page }) => {
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.waitForSelector('[data-testid="desktop"]', { timeout: 5000 });
  const taskbar = await page.locator('[data-testid="taskbar"]');
  await expect(taskbar).toBeVisible();
});

test('Check if start menu opens when clicked', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  const startMenu = await page.locator('[data-testid="start-menu"]');
  await expect(startMenu).toBeVisible();
});

test('Check if Calculator app works', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Calculator').click();
  const calculatorWindow = await page.locator('text="Calculator"').first();
  await expect(calculatorWindow).toBeVisible();
  await page.locator('button:has-text("1")').click();
  await page.locator('button:has-text("+")').click();
  await page.locator('button:has-text("2")').click();
  await page.locator('button:has-text("=")').click();
  const display = await page.locator('[data-testid="calculator-display"]');
  await expect(display).toHaveText('3');
});

test('Check if windows can be dragged', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Calculator').click();
  const windowTitlebar = page.locator('[data-testid="window-titlebar"]').first();
  const initialBoundingBox = await windowTitlebar.boundingBox();
  if (initialBoundingBox) {
    await page.mouse.move(
      initialBoundingBox.x + initialBoundingBox.width / 2,
      initialBoundingBox.y + initialBoundingBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      initialBoundingBox.x + initialBoundingBox.width / 2 + 200,
      initialBoundingBox.y + initialBoundingBox.height / 2 + 100,
      { steps: 10 }
    );
    await page.mouse.up();
    await page.mouse.down();
    await page.mouse.move(
      initialBoundingBox.x + 200,
      initialBoundingBox.y + 100,
      { steps: 10 }
    );
    await page.mouse.up();
    await page.waitForTimeout(500);
    const newBoundingBox = await windowTitlebar.boundingBox();
    expect(newBoundingBox).not.toEqual(initialBoundingBox);
  }
});