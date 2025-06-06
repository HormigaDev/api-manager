# ApiManager Monorepo

Este repositorio contiene la implementación modular de `ApiManager`, una biblioteca para gestionar APIs de forma extensible y desacoplada en proyectos frontend modernos.

## Estructura del Monorepo

```
packages/
│
├── http/         # Módulo principal HTTP
└── websocket/    # Extensión WebSocket opcional
```

## Requisitos

-   Node.js >= 18
-   pnpm (recomendado) o npm/yarn
-   TypeScript >= 5.0

## Instalación

```bash
pnpm install
```

## Scripts disponibles

```bash
pnpm build     # Compila todos los paquetes
pnpm dev       # (si lo necesitas para desarrollo futuro)
```

## Publicación

Cada paquete es independiente y se publica por separado:

```bash
cd packages/http
npm publish --access public

cd ../websocket
npm publish --access public
```

## Paquetes

| Paquete                           | Descripción                       |
| --------------------------------- | --------------------------------- |
| `@systekia/api-manager-http`      | Cliente HTTP extensible           |
| `@systekia/api-manager-websocket` | Extensión opcional para WebSocket |

## Buenas prácticas

-   No subir `dist/` al repositorio (`.gitignore` lo excluye).
-   Cada paquete incluye su propio `README.md`, `tsconfig.json`, y `tsup.config.ts`.
-   Usa el sistema de workspaces (`pnpm`, `npm`, o `yarn`) para manejar dependencias internas.

---

Desarrollado por [Systekia](https://github.com/systekia).
