import { expect, test } from "@playwright/test";

test('user login with successful credentials', async ({ page }) => {
	await page.goto('http://localhost:5173/');
    });