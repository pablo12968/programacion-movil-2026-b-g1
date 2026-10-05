# Entrega por GitHub

Autor: **Pablo Esteban Santana Vidal**. GitHub: **pablo12968**.

El clon tiene `origin` apuntando al fork `https://github.com/pablo12968/programacion-movil-2026-b-g1.git` y `upstream` al repositorio de clase. No se encontró un archivo local con el Manual de Entrega; esta guía sigue el flujo especificado en el enunciado.

## Revisar y publicar

Desde la raíz del repositorio, revisa y agrega solo esta actividad:

```powershell
git status --short
git add -- 09-week/actividad-Corregida
git diff --cached -- 09-week/actividad-Corregida
git commit --only -m "Entrega semana 09: UniEventos Ionic React y API Express" -- 09-week/actividad-Corregida
git push origin main
```

Este repositorio tiene otros cambios preparados de trabajos anteriores. `commit --only` con la ruta limita el commit a la actividad; revisa también los commits pendientes de la rama antes de `push`, porque un push publica todos ellos. Si trabajas en otra rama, sustituye `main` por su nombre. No se necesita un Pull Request salvo que el docente lo solicite. Si lo pide, créalo desde tu fork hacia el repositorio y la rama indicados por él.

Enlace esperado después de publicar en main: [actividad-Corregida en el fork](https://github.com/pablo12968/programacion-movil-2026-b-g1/tree/main/09-week/actividad-Corregida).

## Repositorio de perfil y CONFIG

El requisito exige un repositorio público llamado **pablo12968**, cuyo README se muestra en el perfil. Comprueba que su archivo `README.md` incluya este bloque con los datos correctos:

```text
<!-- CONFIG
FULL_NAME: Pablo Esteban Santana Vidal
GITHUB_USER: pablo12968
-->
```

Usa el formato exacto indicado por el docente si su Manual especifica un delimitador diferente. Tener el bloque en este documento no sustituye añadirlo al README del repositorio de perfil.

## Lista antes de entregar

- [ ] Ejecutar `npm ci`, `npm test` y `npm run build`.
- [ ] Revisar lista, creación, detalle y recuperación ante errores con `npm run dev`.
- [ ] Revisar las capturas y el registro de pruebas en `evidencias/`.
- [ ] Confirmar nombre y bloque CONFIG en el repositorio de perfil.
- [ ] Hacer commit y push de la actividad al fork.
- [ ] Abrir en GitHub el enlace a la carpeta y comprobar que el README aparece.
- [ ] Crear Pull Request únicamente si lo solicita el docente.

La nota final depende de la revisión docente. El proyecto está organizado para demostrar los cuatro criterios de la rúbrica; la publicación y el perfil son pasos adicionales de la entrega.
