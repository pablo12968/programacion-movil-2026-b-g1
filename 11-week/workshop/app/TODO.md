# TODO · Parcial práctico C2 (versión 2)

Ventana de entrega: desde el viernes 9 de octubre hasta el sábado 10 de octubre de 2026, 11:59 p. m. Esfuerzo sugerido: de 6 a 8 horas repartidas en el día.

Trabaje las partes en orden. Cada punto indica qué se verifica. Busque en el código los comentarios `TODO(Parte N)`.

Convenciones (del framework, `coding-standards`): tipos y componentes en `PascalCase`, variables y funciones en `camelCase`, constantes en `UPPER_SNAKE_CASE`, booleanos con prefijo `is` / `has` / `should`, carpetas de funcionalidad en `kebab-case`.

Alcance: todo lo que se pide se vio en las semanas 6 a 9 (entorno y herramientas, Kotlin y TypeScript/React, backend Node con Express, Ionic React y el framework de gobierno).

## Parte 1 · Documentar antes de codificar (0,75)

Copie cada plantilla de `docs/` con su nombre definitivo y llénela; una copia sin cambios no cuenta. **Haga un commit solo de documentos antes de escribir código.**

1. [ ] `docs/features/productos.md` a partir de `_template-feature.md`: propósito, tabla de pantallas con sus rutas, estado (patrón y transiciones), datos (endpoints), casos límite y pruebas previstas.
2. [ ] Al menos **3 de las 4 pantallas** en `docs/screens/` a partir de `_template-screen.md` (lista, detalle, formulario crear/editar): regiones, estados y acciones.
3. [ ] `docs/decisions/ADR-001-estado.md` a partir de `_template-adr.md`: contexto, decisión (cómo se maneja el estado), alternativas y consecuencias.
4. [ ] `docs/decisions/ADR-002-consumo-api.md` a partir de `_template-adr.md`: cómo la app consume la API (`fetch`, `API_URL`, `ApiError`, dónde se traducen los errores), alternativas y consecuencias.
5. [ ] `docs/api/products-endpoints.md` a partir de `_template-endpoint-integration.md`: los **5 endpoints** con parámetros, cuerpo, respuestas de éxito, errores y comportamiento de la app.
6. [ ] `docs/api/product-entity.md` a partir de `_template-entity.md`: campos y reglas de la entidad `Product` (tipo, obligatoriedad, restricciones); lo que no aplique (persistencia, índices, sincronización) se llena con «N/A (almacenamiento en memoria)».

## Parte 2 · API Express (1,0)

Todo el trabajo va en `server/app.js` (`server/index.js` ya está dado). Ya vienen hechos `express.json()`, `cors()`, `parseId()`, el manejador 404 y el manejador central de errores: se usan y se explican, no se escriben. Pruebe con `npm run server`.

7. [ ] **Cinco endpoints** con el contrato del README: lista, detalle, crear, actualizar y eliminar, con los códigos exactos (200, 201, 204, 400, 404) y el formato de error `{ error, details[] }`. (0,7 junto con los puntos 8 a 10)
8. [ ] **Validación** del cuerpo en POST y PUT: `name` (texto no vacío, máximo 60), `price` (número mayor que 0), `category` (una de `CATEGORIES`) y `stock` (entero mayor o igual que 0). Errores `400` con un mensaje en `details` por cada problema.
9. [ ] **Filtros** de `GET /api/products` con `req.query`: `search` (el nombre contiene el texto, sin distinguir mayúsculas) y `category` (exacta).
10. [ ] `id` no numérico (`parseId` devuelve `null`) → `400`; id inexistente → `404`; la creación asigna un id incremental.
11. [ ] **Comprensión de los manejadores dados (0,3):** una prueba que provoque un 404 (o un 500) y su explicación en la sección «API error handling» del README. Conserve el manejador 404 y el de errores que vienen en `createApp()`.

## Parte 3 · App Ionic (1,5)

Todo el trabajo va dentro de `src/features/products/`, respetando las capas `data`, `domain` y `presentation`. El estado de cada pantalla vive en la página con `useState` y `useEffect`; si prefiere extraerlo a un hook propio, también se acepta.

12. [ ] `data/products-api.ts`: `getProduct`, `createProduct`, `updateProduct` y `deleteProduct`, replicando el patrón de `getProducts` (que ya viene resuelta).
13. [ ] `domain/product.ts`: implementar `validateProduct()`, `toProductView()` (con `formatCOP` y la etiqueta de stock) y `filterProducts()` según el contrato de cada función.
14. [ ] **Lista** (`presentation/ProductListPage.tsx`): buscador por texto (`IonInput`) y filtro por categoría con un `IonButton` por categoría («Todas», «Bebidas», «Snacks», «Aseo», «Hogar») y una variable de estado; los cuatro estados: **cargando**, **vacío**, **sin resultados** y **error con botón «Reintentar»** (puede apoyarse en `EmptyState`); se actualiza al volver desde otra pantalla (el esqueleto ya lo hace).
15. [ ] **`ProductCard`** reutilizable (`presentation/ProductCard.tsx`), por analogía con `EmptyState`: props tipadas; muestra nombre, categoría, precio y la etiqueta de stock con aviso visible.
16. [ ] **Detalle** (`presentation/ProductDetailPage.tsx`): todos los campos, carga y error (incluido «no encontrado»), botón Editar y botón Eliminar con confirmación simple en pantalla.
17. [ ] **Formulario** (`presentation/ProductFormPage.tsx`) para crear y editar: validación en línea con `validateProduct()` y, cuando el servidor rechaza, su mensaje y sus `details`.
18. [ ] Rutas y navegación completas: `/productos`, `/productos/nuevo`, `/productos/:id` y `/productos/:id/editar` (ya declaradas en `src/app/App.tsx`); nombres según `coding-standards`.

## Parte 4 · Kotlin (0,5)

Solo con lo visto en la semana 7. Debe compilar o correr en el [Kotlin Playground](https://play.kotlinlang.org).

19. [ ] `kotlin/Product.kt`: clase `Product` con `val`/`var` donde corresponda y un campo que admita `null`.
20. [ ] `stockLabel(stock: Int?): String` y `applyDiscount(price: Double, percent: Int): Double`, con manejo de `null`.
21. [ ] `main()` que imprime tres productos con su etiqueta de stock y su precio con descuento.

## Parte 5 · Calidad (0,5)

22. [ ] Al menos **4 pruebas nuevas** que pasan con `npm test`: **2 o más unitarias** (de `validateProduct`, `toProductView` o `filterProducts`) y **2 o más de la API** (por ejemplo, POST inválido → 400 y GET inexistente → 404), usando el helper `startTestServer()` como en el ejemplo de `src/features/products/__tests__/`.
23. [ ] Marcar el checklist de `docs/definition-of-done.md` en la descripción del PR (copie la lista y marque lo que cumple; lo que no aplique, indíquelo).
24. [ ] Ningún secreto en el repositorio: `.env` está ignorado y solo se versiona `.env.example`.

## Parte 6 · Git y entrega (0,25)

25. [ ] Trabajar en una rama `feature/…` o `feat/…` (no directamente en `main`).
26. [ ] Al menos **6 commits** con Conventional Commits (`type(scope): resumen`, en imperativo, 72 caracteres o menos).
27. [ ] **PR hacia el `main` de su propio fork**, con descripción. Pegar el enlace en Moodle antes del cierre.
28. [ ] README con cómo ejecutar (`npm run server` y `npm run dev`).

## Parte 7 · Inglés (0,5)

29. [ ] En el README, una sección titulada **State management decision**, en inglés, de 3 a 5 frases: qué patrón de estado se eligió (`useState`, un store, etc.), por qué, y qué cambiaría si la aplicación creciera. (0,25)
30. [ ] En el README, una sección titulada **API error handling**, en inglés, de 3 a 5 frases: cómo distingue el cliente un error de red de una respuesta no exitosa, qué hace con `ApiError`, qué hacen los manejadores 404 y de errores de la API, y qué ve la persona usuaria. (0,25)

## Antes de entregar

- [ ] `npm test` pasa.
- [ ] `npm run lint` y `npm run build` no muestran errores.
- [ ] `npm run server` y `npm run dev` arrancan, y la app funciona contra la API.
- [ ] El primer commit de código es posterior al commit de documentación.
- [ ] El enlace del PR está pegado en la actividad de Moodle.
