import { test, expect } from '@playwright/test';

async function fillForm(page, title) {
  await page.getByLabel('Nombre del evento').fill(title);
  await page.getByLabel('Fecha', { exact: true }).fill('2026-11-22');
  await page.getByLabel('Lugar', { exact: true }).fill('Biblioteca central');
  await page.getByLabel('Descripción').fill('Encuentro abierto para compartir proyectos de la comunidad.');
}

test('lista, crea, filtra, abre detalle, recarga y vuelve', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Agenda del campus' })).toBeVisible();
  await expect(page.locator('.event-card').first()).toBeVisible();
  const title = `Encuentro ${testInfo.project.name} ${Date.now()}`;
  await fillForm(page, title);
  await page.getByRole('button', { name: 'Publicar evento', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('se publicó correctamente');
  await expect(page.getByLabel('Nombre del evento')).toHaveValue('');
  await page.getByRole('button', { name: 'Cultural', exact: true }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await page.getByRole('link', { name: `Ver detalle de ${title}`, exact: true }).click();
  await expect(page.locator('.detail-card h1')).toHaveText(title);
  await page.reload();
  await expect(page.locator('.detail-card h1')).toHaveText(title);
  await page.getByRole('button', { name: 'Volver a eventos', exact: true }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('error de red al listar permite reintentar', async ({ page }) => {
  await page.route('**/api/eventos', route => route.abort());
  await page.goto('/eventos');
  await expect(page.getByRole('alert')).toContainText('No pudimos conectar');
  await page.unroute('**/api/eventos');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.locator('.event-card').first()).toBeVisible();
});

test('POST fallido conserva formulario y permite corregir y publicar', async ({ page }) => {
  await page.goto('/eventos');
  await expect(page.locator('.event-card').first()).toBeVisible();
  await fillForm(page, 'Evento conservado');
  await page.route('**/api/eventos', route => route.request().method() === 'POST' ? route.abort() : route.continue());
  await page.getByRole('button', { name: 'Publicar evento', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('No pudimos conectar');
  await expect(page.getByLabel('Nombre del evento')).toHaveValue('Evento conservado');
  await page.unroute('**/api/eventos');
  await page.getByRole('button', { name: 'Publicar evento', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('se publicó correctamente');
});

test('validación del servidor se muestra junto al campo', async ({ page }) => {
  await page.goto('/eventos');
  await expect(page.locator('.event-card').first()).toBeVisible();
  await fillForm(page, '   ');
  await page.getByRole('button', { name: 'Publicar evento', exact: true }).click();
  await expect(page.locator('#titulo-error')).toHaveText('Debe tener entre 3 y 100 caracteres.');
  await expect(page.getByLabel('Nombre del evento')).toHaveAttribute('aria-invalid', 'true');
});

test('lista vacía y detalle inexistente son estados claros', async ({ page }) => {
  await page.route('**/api/eventos', route => route.fulfill({ json: [] }));
  await page.goto('/eventos');
  await expect(page.getByRole('heading', { name: 'Aún no hay eventos', exact: true })).toBeVisible();
  await page.goto('/eventos/id-inexistente');
  await expect(page.getByRole('alert')).toContainText('El evento no existe.');
  await page.getByRole('button', { name: 'Volver a eventos', exact: true }).click();
  await expect(page).toHaveURL(/\/eventos$/);
});

test('presentación adaptable sin desbordamiento horizontal', async ({ page }, testInfo) => {
  await page.goto('/eventos');
  await expect(page.locator('.event-card').first()).toBeVisible();
  expect(await page.locator('.page-shell').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: `evidencias/${testInfo.project.name}-agenda.png`, fullPage: true });
  await page.locator('.form-panel').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `evidencias/${testInfo.project.name}-formulario.png`, fullPage: true });
  await page.goto('/eventos/1');
  await expect(page.locator('.detail-card h1')).toHaveText('Ideas que transforman el campus');
  await page.screenshot({ path: `evidencias/${testInfo.project.name}-detalle.png`, fullPage: true });
});
