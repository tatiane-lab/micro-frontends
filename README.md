# Micro-frontends with Native Federation

> Angular 22 · `@angular-architects/native-federation` · Shell + 2 Remotes · Shared Event Bus · Independent Deploys

A micro-frontend architecture with a host shell and two independent remote applications sharing dependencies at runtime.

## Architecture

```
ng-micro-frontends/ (shell - port 4200)
├── src/app/
│   ├── app.routes.ts            # loadRemoteModule for each MFE
│   └── services/
│       └── shared-event-bus.service.ts   # Subject-based cross-MFE events
├── federation.config.js          # Native Federation shell config
└── projects/
    ├── products-remote/          # Products MFE (port 4201)
    │   └── federation.config.js  # exposes ./ProductsModule
    └── cart-remote/              # Cart MFE (port 4202)
        └── federation.config.js  # exposes ./CartModule
```

## Features

- **Native Federation** – replaces Webpack Module Federation with a standards-based ES module approach; each remote publishes a `remoteEntry.json`; the shell uses `loadRemoteModule()` as a lazy route.
- **Pinned shared dependencies** – `shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })` pins Angular, RxJS and common libs to avoid version conflicts; `rxjs/ajax` and test modules are excluded.
- **Cross-remote communication** – `SharedEventBusService` wraps a single `Subject<BusEvent>` and exposes typed `on<T>()` and `emit()` methods; remotes subscribe without tight coupling to the shell.
- **Independent CI deploys** – each remote is a separate build target; a GitHub Actions matrix job builds and deploys each one to its own URL independently.

## Running locally

```bash
# Terminal 1 — shell
npm run start:shell

# Terminal 2 — products remote
npm run start:products

# Terminal 3 — cart remote
npm run start:cart
```

## Tech Stack

| Package | Version |
|---|---|
| `@angular/core` | ^22.3.0 |
| `@angular-architects/native-federation` | ^19.0.0 |
