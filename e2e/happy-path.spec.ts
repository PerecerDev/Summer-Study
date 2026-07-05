import { expect, test, type Page } from '@playwright/test';

async function abandonActiveRound(page: Page) {
  const response = await page.request.get('/api/v1/rounds/active');
  if (!response.ok()) return;

  const data = (await response.json()) as { round?: { id: string } } | null;
  if (!data?.round?.id) return;

  await page.request.post(`/api/v1/rounds/${data.round.id}/abandon`);
}

async function skipCurrentExercise(page: Page) {
  await page.getByRole('button', { name: 'Saltar' }).click();
  await page.getByRole('button', { name: 'Sí, saltar' }).click();

  const continueButton = page.getByTestId('exercise-continue');
  const resultsPage = page.getByTestId('results-page');
  const roundComplete = page.getByTestId('round-complete');

  await expect(continueButton.or(resultsPage).or(roundComplete)).toBeVisible({
    timeout: 20_000,
  });

  if (await resultsPage.isVisible()) return;
  if (await roundComplete.isVisible()) {
    await roundComplete.click();
    return;
  }

  await continueButton.click();
}

test.describe('Happy path', () => {
  test('login → math round → results', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('/login');

    await page.getByTestId('login-username').fill('estudiante');
    await page.getByTestId('login-password').fill('1234');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL('/', { timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /¿Qué quieres practicar hoy?/ })).toBeVisible({
      timeout: 10_000,
    });

    await abandonActiveRound(page);

    await page.getByTestId('subject-math').click();

    await expect(page.getByRole('button', { name: 'Saltar' })).toBeVisible({ timeout: 30_000 });

    for (let index = 0; index < 3; index += 1) {
      if (await page.getByTestId('results-page').isVisible()) break;
      await skipCurrentExercise(page);
    }

    if (!(await page.getByTestId('results-page').isVisible())) {
      await page.getByTestId('round-complete').click();
    }

    await expect(page.getByTestId('results-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Has acertado/)).toBeVisible();
  });
});
