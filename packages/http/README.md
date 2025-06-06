# @systekia/api-manager-http

`@systekia/api-manager-http` es una librería HTTP extensible y modular para proyectos frontend (Next.js, React, Vue, Svelte, Nuxt.js), escrita en TypeScript y usable desde JavaScript.

## 🚀 Instalación

```bash
npm install @systekia/api-manager-http
```

## 📦 Uso básico

```ts
import { ApiManager } from '@systekia/api-manager-http';

const api = new ApiManager({
    baseUrl: 'https://api.example.com',
    format: 'json', // json | xml | binary
    auth: { type: 'bearer', token: 'tu-token' },
    throwErrors: true,
});

const { data } = await api.get('/users');
```

## 🌐 Métodos HTTP disponibles

```ts
api.get(endpoint, params?);
api.post(endpoint, body?);
api.put(endpoint, body?);
api.patch(endpoint, body?);
api.delete(endpoint, params?);
api.options(endpoint, params?);
api.head(endpoint, params?);
```

## 🔐 Autenticación

-   `bearer`: agrega `Authorization: Bearer {token}`
-   `cookie`: usa `credentials: include` o `same-origin`

```ts
auth: {
  type: 'cookie',
  credentials: 'include'
}
```

## 📡 Formatos soportados

-   `json`: por defecto
-   `xml`: debes enviar string ya serializado
-   `binary`: recibe `ArrayBuffer`

## ⚠️ Manejo de errores

Puedes suscribirte a errores específicos:

```ts
api.on('HttpError', (err) => console.warn('Error HTTP', err));
api.on('Error', (err) => console.error('Error general', err));
```

Enum de errores disponibles:

```ts
ApiManagerErrors.HttpError;
ApiManagerErrors.Error;
```

## 🧩 Extensible

Esta librería está pensada para ser extendida. Por ejemplo, puedes usar una extensión opcional para WebSockets:

```ts
import { withWebSocket } from '@systekia/api-manager-http/websocket';

const wsApi = withWebSocket(api, { url: 'wss://...' });
wsApi.websocket.send('event', { foo: 'bar' });
```

## 🧪 Tipado completo

-   Compatible con TypeScript
-   Compatible con JavaScript

---

MIT License © SYSTEKIA Studios
