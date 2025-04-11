import { test, expect } from '@playwright/test';
import { useDesktopStore } from '../client/src/store/desktop';

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

test('Check if we can manage multiple windows', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Calculator').click();
  const calculatorWindow = await page.locator('[data-testid^="window-"]').filter({ hasText: 'Calculator' }).first();
  await expect(calculatorWindow).toBeVisible();
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Text Editor').click();
  const editorWindow = await page.locator('[data-testid^="window-"]').filter({ hasText: 'Text Editor' }).first();
  await expect(editorWindow).toBeVisible();
  await expect(editorWindow).toHaveAttribute('data-active', 'true');
  const windowTitlebar = page.locator('[data-testid="window-titlebar"]').first();
  const initialBoundingBox = await windowTitlebar.boundingBox();
  while (initialBoundingBox) {
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
    await page.waitForTimeout(500);
    const isCalculatorClickable = await calculatorWindow.isVisible();
    if (isCalculatorClickable) {
      break;
    }
  }
  await calculatorWindow.click();
  await page.waitForTimeout(500);
  await expect(calculatorWindow).toHaveAttribute('data-active', 'true');
  await expect(editorWindow).toHaveAttribute('data-active', 'false');
});

test('Check if the actions minimize, maximize, and restore works', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Calculator').click();
  const window = await page.locator('[data-testid^="window-"]').first();
  const windowtitlebar = await page.locator('[data-testid="window-titlebar"]').first();
  const maximizeButton = await windowtitlebar.locator('[data-testid="maximize-button"]');
  const minimizeButton = await windowtitlebar.locator('[data-testid="minimize-button"]');
  const initialBoundingBox = await window.boundingBox();
  await maximizeButton.click();
  await page.waitForTimeout(500);
  await expect(window).toHaveClass(/fixed/);
  const maximizedBoundingBox = await window.boundingBox();
  expect(maximizedBoundingBox?.width).toBeGreaterThan(initialBoundingBox?.width || 0);
  expect(maximizedBoundingBox?.height).toBeGreaterThan(initialBoundingBox?.height || 0);
  await maximizeButton.click();
  await page.waitForTimeout(500);
  await expect(window).not.toHaveClass(/fixed/);
  await minimizeButton.click();
  await page.waitForTimeout(500);
  await expect(window).not.toBeVisible();
  await page.locator('[data-testid="taskbar-item-calculator"]').click();
  await expect(window).toBeVisible();
});

test('Check if windows close properly', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await removewelcome(page);
  await page.reload();
  await waitforsplash(page);
  await page.locator('[data-testid="start-button"]').click();
  await page.locator('text=Calculator').click();
  const window = await page.locator('div').filter({ has: page.locator('[data-testid="window-titlebar"]') }).first();
  await expect(window).toBeVisible();
  await page.locator('[data-testid="close-button"]').click();
  await page.waitForTimeout(300);
  await expect(window).not.toBeVisible();
});