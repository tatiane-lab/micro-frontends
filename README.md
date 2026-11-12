# Micro-frontends com Native Federation

> Angular 22 · `@angular-architects/native-federation` · Shell + 2 remotes · Estado compartilhado · Fallback quando um remote cai

Um shell (host) que carrega, sob demanda e em tempo de execução, dois micro-frontends independentes (`products-remote` e `cart-remote`). Os três compartilham o mesmo Angular, a mesma sessão de login e o mesmo carrinho.

## Credenciais demo

| Campo | Valor |
|---|---|
| E-mail | `demo@portfolio.dev` |
| Senha | `demo123` |

A tela de login também tem o botão **Entrar como demo** (e o carrinho, quando rodando sem sessão, oferece o mesmo atalho).

## Como rodar

```bash
npm install
npm start          # alias de npm run start:all: sobe shell + 2 remotes juntos
```

| App | Porta | URL |
|---|---|---|
| shell (host) | 4220 | http://localhost:4220 |
| products-remote | 4221 | http://localhost:4221 (modo standalone) |
| cart-remote | 4222 | http://localhost:4222 (modo standalone) |

Scripts individuais: `npm run start:shell`, `start:products`, `start:cart`. Também: `npm run build` (compila os três) e `npm test` (Vitest).

## Arquitetura

```
                    ┌──────────────────────────────────────────┐
                    │ shell (4220)                             │
                    │ login · sidebar · guard · toasts · home  │
                    │ federation.manifest.json                 │
                    └───────────┬──────────────────┬───────────┘
        loadRemoteModule()      │                  │      loadRemoteModule()
        (lazy, com fallback)    ▼                  ▼      (lazy, com fallback)
                   ┌────────────────────┐  ┌────────────────────┐
                   │ products-remote    │  │ cart-remote        │
                   │ (4221)             │  │ (4222)             │
                   │ expõe ./Routes     │  │ expõe ./Routes     │
                   └─────────┬──────────┘  └──────────┬─────────┘
                             │   @mfe/shared (singleton) │
                             └──────────┬───────────────┘
                     SessionService · CartStore (signals) · EventBus
```

```
src/                         shell: app.ts (layout), pages/ (login, home, fallback), core/ (guard, remote-loader)
projects/products-remote/    catálogo: busca, filtro, ordenação, adicionar ao carrinho
projects/cart-remote/        carrinho: quantidades, total, finalizar compra (exige login)
projects/shared/             @mfe/shared: SessionService, CartStore, EventBus, BrlPipe, tokens de design
public/federation.manifest.json   mapa remote -> remoteEntry.json (host dinâmico)
```

## Como os MFEs conversam

- **Estado compartilhado:** `@mfe/shared` é um *shared mapping* singleton da federação, então shell e remotes usam a **mesma instância** de `SessionService` e `CartStore`. Ambos usam `signal`/`computed` e persistem em `localStorage` (a sessão e o carrinho sobrevivem a reload e funcionam com os remotes em modo standalone).
- **Eventos:** `EventBus` tipado (`MfeEvents`) para notificações desacopladas. Ex.: o catálogo dispara `cart:item:added`, o carrinho dispara `cart:checkout`, e o shell escuta ambos para exibir toasts.
- **Sessão:** o login acontece no shell; o carrinho só permite finalizar a compra com usuário autenticado.

## Resiliência

`loadRemoteRoutes()` (`src/app/core/remote-loader.ts`) envolve `loadRemoteModule` em `try/catch`. Se o remote estiver fora do ar, a rota exibe uma tela "indisponível" com botão *Tentar novamente* e o restante do shell continua funcionando. A Home mostra a saúde (online/offline) de cada remote lendo o manifest.

## Decisões

- **Host dinâmico + manifest:** as URLs dos remotes ficam em `federation.manifest.json`, não no código; em produção basta trocar o manifest, sem rebuild do shell.
- **Lib `@mfe/shared` em vez de serviços duplicados:** evita instâncias diferentes de estado em cada bundle.
- **Angular moderno:** componentes standalone, `OnPush`, signals, novo control flow (`@if`/`@for`), tipagem estrita, rotas lazy.
- **`BrlPipe` próprio** (via `Intl.NumberFormat`) em vez de `CurrencyPipe` + locale: os dados de locale são um subpath do `@angular/common` que não é compartilhado pela federação em runtime.
- **TypeScript 6 / Angular 22.2:** exigidos pela versão atual do `@angular-architects/native-federation` (22.2.x). O `.npmrc` usa `legacy-peer-deps` por conta dos peers do Angular 22.3.

## Stack

Angular 22.2 · Native Federation 22.2 · RxJS 7.8 · TypeScript 6 · Vitest · SCSS
