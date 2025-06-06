# @systekia/api-manager-websocket

Extensión WebSocket para `@systekia/api-manager-http`. Permite manejar comunicación en tiempo real con reconexión automática, heartbeat y listeners múltiples.

## Instalación

```bash
npm install @systekia/api-manager-websocket
```

## Uso básico

```ts
import { ApiWebSocket } from '@systekia/api-manager-websocket';

const ws = new ApiWebSocket({
    url: 'wss://example.com/socket',
    autoConnect: true,
    debug: true,
    reconnect: true,
    heartbeatIntervalMs: 15000,
});

ws.on('chat', (data) => {
    console.log('Mensaje:', data);
});

ws.send('chat', { message: 'Hola mundo' });
```

## Opciones disponibles

| Opción                | Tipo      | Descripción                                          |
| --------------------- | --------- | ---------------------------------------------------- |
| `url`                 | `string`  | URL del servidor WebSocket                           |
| `debug`               | `boolean` | Si `true`, se muestran errores por consola           |
| `autoConnect`         | `boolean` | Conecta automáticamente al instanciar                |
| `reconnect`           | `boolean` | Reintenta conexión automáticamente                   |
| `reconnectIntervalMs` | `number`  | Tiempo de espera para reintento en milisegundos      |
| `heartbeatIntervalMs` | `number`  | Intervalo de heartbeat en milisegundos (enviar ping) |

## Métodos

-   `connect()`: Inicia manualmente la conexión.
-   `close()`: Cierra la conexión.
-   `isConnected()`: Devuelve `true` si la conexión está abierta.
-   `send(event, data)`: Envía un mensaje con un nombre de evento.
-   `on(event, handler)`: Registra un handler para un evento.
-   `off(event, handler)`: Elimina un handler.

---

Esta extensión es opcional y desacoplada del módulo HTTP principal.
