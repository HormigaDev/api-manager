# 🧰 @systekia/api-manager Monorepo

Este monorepo contiene una colección de herramientas enfocadas en facilitar la comunicación HTTP y WebSocket en proyectos frontend modernos. Todos los paquetes están escritos en TypeScript, pero también son completamente compatibles con JavaScript.

## 📦 Paquetes incluidos

### 1. [`@systekia/api-manager-http`](./packages/http)

Librería HTTP extensible y modular para proyectos frontend como React, Vue, Svelte, Next.js o Nuxt.js.

#### Características principales:

-   Soporta todos los métodos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.).
-   Autenticación vía token `bearer` o `cookie`.
-   Formatos de datos: `json`, `xml`, `binary`.
-   Sistema de eventos para manejar errores.
-   Arquitectura extensible para adaptarse a nuevas necesidades.

#### Ejemplo básico:

```ts
import { ApiManager } from '@systekia/api-manager-http';

const api = new ApiManager({
    baseUrl: 'https://api.example.com',
    format: 'json',
    auth: { type: 'bearer', token: 'tu-token' },
});

const { data } = await api.get('/users');
```

---

### 2. [`@systekia/api-manager-websocket`](./packages/websocket)

Extensión WebSocket opcional para manejar comunicación en tiempo real con reconexión, heartbeat y sistema de eventos.

#### Características principales:

-   Conexión automática y reconexión configurable.
-   Heartbeat para mantener la conexión viva.
-   Registro de múltiples listeners por evento.
-   Totalmente desacoplado del módulo HTTP.

#### Ejemplo básico:

```ts
import { ApiWebSocket } from '@systekia/api-manager-websocket';

const ws = new ApiWebSocket({
    url: 'wss://example.com/socket',
    autoConnect: true,
    heartbeatIntervalMs: 15000,
});

ws.on('chat', (data) => {
    console.log('Mensaje recibido:', data);
});

ws.send('chat', { message: 'Hola mundo' });
```

---

## 🧪 Tipado

-   100% compatible con TypeScript
-   Usable desde proyectos JavaScript

## 📄 Licencia

MIT License © SYSTEKIA Studios
