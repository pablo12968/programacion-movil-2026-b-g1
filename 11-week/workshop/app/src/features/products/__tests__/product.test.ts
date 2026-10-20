import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import { CATEGORIES, formatCOP, LOW_STOCK_THRESHOLD } from '../domain/product';

/**
 * Pruebas unitarias de EJEMPLO (ya vienen dadas) para que `npm test` corra desde el inicio.
 * Muestran el estilo esperado: describe / it / expect, sin red ni pantallas.
 */
describe('datos semilla de la API (ejemplo)', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);
    expect(seedProducts.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(item.category);
      expect(Number.isInteger(item.stock)).toBe(true);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades para probar las etiquetas', () => {
    expect(seedProducts.some((item) => item.stock === 0)).toBe(true);
    expect(seedProducts.some((item) => item.stock > 0 && item.stock < LOW_STOCK_THRESHOLD)).toBe(true);
  });
});

describe('formatCOP (ejemplo)', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

/**
 * TODO(Parte 5): agregue sus pruebas UNITARIAS aquí (o en archivos nuevos dentro de __tests__/).
 * Mínimo dos de estas funciones del dominio: `validateProduct`, `toProductView` o `filterProducts`.
 * Quite el `.todo` cuando escriba el cuerpo de cada una.
 */
describe('validateProduct', () => {
  it.todo('rechaza un nombre vacío, un precio menor o igual que 0 y una categoría no permitida');
});

describe('toProductView', () => {
  it.todo('formatea el precio en pesos y marca «Agotado» y «Pocas unidades»');
});

describe('filterProducts', () => {
  it.todo('filtra por texto sin distinguir mayúsculas y por categoría exacta');
});
