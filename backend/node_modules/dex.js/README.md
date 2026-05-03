# Dex.js

![Alternative to NestJS](https://img.shields.io/badge/alternative%20to-NestJS-red?style=for-the-badge&logo=nestjs) ![Express-based](https://img.shields.io/badge/based%20on-Express.js-blue?style=for-the-badge&logo=express) ![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94%EF%B8%8F-3178C6?style=for-the-badge&logo=typescript) ![Modular Architecture](https://img.shields.io/badge/Modular%20Architecture-%E2%9C%94-green?style=for-the-badge)

> **Dex.js** — A lightweight, modular framework built on top of Express.js, designed to make your backend development faster, cleaner, and way more scalable.

## 🚀 Features
- ✅ Fully modular architecture
- 🚀 Zero boilerplate setup
- 🧠 Decorator-based routing
- 🔥 CLI generator for rapid scaffolding
- 🌐 CORS support out of the box
- 💙 Built with TypeScript

## 📦 Quick Start
### 1. Install the CLI tool
```bash
npm install -g mvc-dex-cli
```
### 2. Initialize a new project
```bash
npx mvc-dex-cli init --dex-js my-dex-app
```
### 3. Add a new controller module
```bash
npx mvc-dex-cli add users
```
### 4. Setup your application in `index.ts`
```ts
import { createDexApp } from 'dex.js';
import usersController from './app/users/users.controller';
import usersService from './app/users/users.service';
import usersModel from './app/users/users.model';

createDexApp({
  port: 5006,
  controllers: [
    {
      Controller: usersController,
      Service: usersService,
      Model: usersModel
    }
  ]
});
```

## 📚 Learn the Dex.js Decorators
### `@ControleRoute(path: string)`
Defines the base route path for a controller.
```ts
@ControleRoute('/users')
class UsersController { ... }
```
### `@RoutePath(method: 'get' | 'post' | 'put' | 'delete', path: string, middlewares?: Function[])`
Defines a method as a route handler.
```ts
@RoutePath('get', '/')
public async getAll(req: Request, res: Response) {
  res.send('Hello from users!');
}
```
With middleware:
```ts
@RoutePath('get', '/', [myMiddleware])
```

## ⚙️ CORS Configuration
You can pass custom CORS options directly to the `createDexApp` function:
```ts
createDexApp({
  port: 5000,
  controllers: [...],
  corsOpt: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});
```

## 🧪 Work In Progress
- [ ] Built-in validation decorators
- [ ] Global exception handling
- [ ] Built-in logger
- [ ] CLI plugin system
- [ ] File-based routing (optional mode)

## 📖 License
MIT © 2025 — made with ❤️ by [DequElite](https://github.com/DequElite)

Wanna contribute or ask something? Open an issue or ping me on GitHub 💬