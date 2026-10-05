# Registro de verificación

Fecha de revisión: **5 de octubre de 2026**. Entorno: Windows, Node.js 24.20.0, npm 11.19.0.

## Resultados ejecutados

| Comando | Resultado |
| --- | --- |
| `npm install` | Dependencias instaladas; auditoría: 0 vulnerabilidades reportadas |
| `npm test` | 6 pruebas de integración aprobadas, 0 fallos |
| `npm run build` | Compilación de producción correcta con Vite 6.4.3 |
| `npm run test:e2e` | 12 pruebas aprobadas, 0 fallos; Chromium, escritorio y Pixel 7 emulado |

La prueba de error de almacenamiento imprime intencionalmente `fallo simulado de almacenamiento`; comprueba una respuesta 500 controlada y no indica un fallo de la ejecución.

## Qué se verificó

- Respuestas JSON en lista y detalle; 201 y Location en creación.
- Identificador generado por el servidor, limpieza de espacios y conservación al reabrir el archivo de datos.
- Rechazo de campos vacíos, tipos incorrectos, fechas imposibles y categorías no válidas.
- Respuestas 400, 404, 413, 415 y 500 controladas.
- Creación desde el formulario real y actualización inmediata de la lista.
- Filtrado por categoría, navegación al detalle, recarga directa y retorno a la agenda.
- Fallo de red al listar, botón de reintento y recuperación.
- Fallo de red en POST, conservación del formulario y envío posterior exitoso.
- Errores de validación del servidor junto a los campos.
- Estados de lista vacía y detalle inexistente.
- Ausencia de errores JavaScript en el recorrido principal y de desbordamiento horizontal en los dos tamaños probados.

## Capturas

- [Agenda en escritorio](desktop-agenda.png)
- [Formulario en escritorio](desktop-formulario.png)
- [Detalle en escritorio](desktop-detalle.png)
- [Agenda en móvil](mobile-agenda.png)
- [Formulario en móvil](mobile-formulario.png)
- [Detalle en móvil](mobile-detalle.png)

Las capturas son de la aplicación real durante las pruebas; pueden incluir eventos creados por esas pruebas. La vista móvil se verificó mediante emulación de Chromium, no en un teléfono físico. No se verificó publicación en GitHub ni el README remoto del repositorio de perfil.

## Comprobación manual adicional

1. Ejecuta `npm run dev` y crea un evento con todos los campos.
2. Detén ambos servidores con Ctrl+C y vuelve a iniciarlos. El evento debe permanecer en la lista.
3. En las herramientas del navegador, activa Network → Offline y actualiza la agenda. Debe mostrarse un error.
4. Desactiva Offline y pulsa Reintentar. Deben aparecer de nuevo los datos.
5. Visita `/eventos/no-existe` y comprueba el mensaje de evento inexistente y el regreso al listado.

Estos pasos son una guía reproducible; el registro automático anterior especifica las verificaciones efectivamente ejecutadas.
