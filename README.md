# 🧱 Estrutura do Projeto

Este projeto segue o padrão **MVC (Model–View–Controller)** com **camadas adicionais de Service e Repository**, muito comum em aplicações **Node.js + Express + MongoDB**.
Essa estrutura facilita a **organização do código**, o **reaproveitamento de lógica** e a **manutenção** a longo prazo.

---

### 🗂️ Responsabilidades por Camada

| Camada                 | Descrição                                                                                                                                                                                                              |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/models`**       | Define a estrutura dos dados e validações básicas. Cada *model* representa uma coleção no MongoDB, utilizando o Mongoose. <br>Exemplo: `UserModel` define os campos `name`, `email`, `password` e regras de validação. |
| **`src/controllers`**  | Recebe as requisições HTTP da rota, interpreta os dados (params, body, query) e envia a resposta ao cliente. Não contém regra de negócio — apenas chama o serviço correto.                                             |
| **`src/services`**     | É onde mora a **lógica de negócio**. Os *services* aplicam regras, validam fluxos e fazem uso dos repositórios para salvar ou buscar dados.                                                                            |
| **`src/repositories`** | Responsável por interagir com o banco de dados (ou outras fontes de dados, como APIs externas). Abstrai operações CRUD em funções reutilizáveis.                                                                       |
| **`src/routes`**       | Define os endpoints HTTP da aplicação. Cada rota é associada a um controller e pode ter middlewares específicos.                                                                                                       |
| **`src/middlewares`**  | Executam antes do controller. São usados para validação, autenticação, autorização, tratamento de erros, etc. <br>Exemplo: `validate.middleware.js`, `error.middleware.js`.                                            |
| **`src/config`**       | Contém configurações globais, como conexão com banco (`db.js`) e carregamento de variáveis de ambiente (`dotenv`).                                                                                                     |
| **`src/app.js`**       | Cria e configura a aplicação Express. Registra middlewares globais e importa todas as rotas.                                                                                                                           |
| **`src/server.js`**    | Ponto de entrada do projeto: inicia o servidor HTTP e escuta a porta definida no `.env`.                                                                                                                               |
| **`.env`**             | Armazena variáveis sensíveis (como `DATABASE_URI`, `PORT`, `JWT_SECRET`) de forma segura.                                                                                                                              |
| **`package.json`**     | Contém scripts, dependências, nome, versão e metadados do projeto.                                                                                                                                                     |
| **`README.md`**        | Documento de referência do projeto, contendo instruções de uso e setup.                                                                                                                                                |

---

## 🔁 Fluxo de Requisição

Abaixo está o passo a passo de como uma requisição percorre o sistema:

1. **Rota (`src/routes`)**
   O Express recebe a requisição (por exemplo, `POST /users`) e identifica a rota correspondente.
   → Aplica middlewares definidos na rota (ex: validação de dados).

2. **Controller (`src/controllers`)**
   O controller recebe os dados da requisição (body, params, query) e chama o método do serviço adequado.
   → Exemplo: `UserController.createUser(req, res)` chama `UserService.createUser()`.

3. **Service (`src/services`)**
   O service aplica regras de negócio, validações e chamadas externas.
   → Exemplo: verifica se o e-mail já está cadastrado antes de criar o usuário.

4. **Repository (`src/repositories`)**
   O repository executa a operação real no banco de dados (via Mongoose).
   → Exemplo: `UserRepository.createUser(data)` faz `UserModel.create(data)`.

5. **Model (`src/models`)**
   O Mongoose valida e persiste o dado na coleção correspondente.

6. **Response**
   O controller recebe o retorno e envia uma resposta HTTP adequada ao cliente, com `status` e `payload`.

7. **Middlewares Globais (`src/middlewares`)**
   Lidam com erros, logs e autenticação em todas as rotas.

---

## ⚙️ Configuração Inicial do Projeto

## 🧩 Criação da Estrutura de Pastas

Execute o comando abaixo no terminal para gerar toda a estrutura inicial do projeto:

```bash
mkdir -p projeto/src/{models,controllers,services,repositories,routes,middlewares,config}

touch projeto/src/app.js \
      projeto/src/server.js \
      projeto/src/middlewares/error.middleware.js \
      projeto/src/middlewares/validate.middleware.js \
      projeto/src/config/db.js \
      projeto/src/models/user.model.js \
      projeto/src/controllers/user.controller.js \
      projeto/src/services/user.service.js \
      projeto/src/repositories/user.repository.js \
      projeto/src/routes/user.routes.js \
      projeto/.env \
      projeto/package.json \
      projeto/README.md
```


> **Stack**: Node.js + Express + Mongoose | ES Modules
> **Recursos**: criar usuário (com hash de senha), listar, buscar por ID, atualizar, remover

---

## 0) Dependências e estrutura

```bash
npm init -y
npm install express mongoose dotenv bcrypt
npm install -D nodemon
```

`package.json` (trecho essencial):

```json
{
  "name": "projeto-exemplo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

`.env`:

```env
DATABASE_URI=mongodb://localhost:27017/exemplo_users
PORT=3000
BCRYPT_SALT_ROUNDS=10
```

---

## 1) Conexão com o banco — `src/config/db.js`

```js
// src/config/db.js
import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  }
}
```

---

## 2) Model — `src/models/user.model.js`

```js
// src/models/user.model.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    passwordHash: { type: String, required: true, select: false }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
```

> Observação: armazenamos **`passwordHash`** (e não a senha em texto). O campo é `select: false` para não vazar por padrão.

---

## 3) Repository — `src/repositories/user.repository.js`

```js
// src/repositories/user.repository.js
import { UserModel } from '../models/user.model.js';

export const UserRepository = {
  async create(data) {
    const doc = await UserModel.create(data);
    return doc.toObject();
  },

  async findAll() {
    return UserModel.find().lean();
  },

  async findById(id) {
    return UserModel.findById(id).lean();
  },

  async findByEmail(email, { includePassword = false } = {}) {
    const query = UserModel.findOne({ email });
    if (includePassword) query.select('+passwordHash');
    return query.lean();
  },

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  },

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }
};
```

---

## 4) Service — `src/services/user.service.js`

```js
// src/services/user.service.js
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export const UserService = {
  async createUser({ name, email, password }) {
    if (!name || !email || !password) {
      throw { status: 400, message: 'name, email e password são obrigatórios.' };
    }

    const exists = await UserRepository.findByEmail(email);
    if (exists) {
      throw { status: 409, message: 'E-mail já cadastrado.' };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await UserRepository.create({ name, email, passwordHash });

    // nunca retornar hash
    delete created.passwordHash;
    return created;
  },

  async listUsers() {
    return UserRepository.findAll();
  },

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
    return user;
  },

  async updateUser(id, { name, password }) {
    const data = {};
    if (name) data.name = name;
    if (password) data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const updated = await UserRepository.updateById(id, data);
    if (!updated) throw { status: 404, message: 'Usuário não encontrado.' };
    delete updated?.passwordHash;
    return updated;
  },

  async deleteUser(id) {
    const deleted = await UserRepository.deleteById(id);
    if (!deleted) throw { status: 404, message: 'Usuário não encontrado.' };
    return { ok: true };
  }
};
```

---

## 5) Controller — `src/controllers/user.controller.js`

```js
// src/controllers/user.controller.js
import { UserService } from '../services/user.service.js';

export const UserController = {
  async create(req, res, next) {
    try {
      const result = await UserService.createUser(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async list(req, res, next) {
    try {
      const result = await UserService.listUsers();
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await UserService.getUserById(req.params.id);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await UserService.updateUser(req.params.id, req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
};
```

---

## 6) Middlewares (opcionais, mas recomendados)

### `src/middlewares/error.middleware.js`

```js
// src/middlewares/error.middleware.js
export function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  if (status >= 500) {
    console.error('💥', err);
  }
  return res.status(status).json({ message });
}
```

### `src/middlewares/validate.middleware.js` (validação bem simples de exemplo)

```js
// src/middlewares/validate.middleware.js
export function requireFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body?.[f] == null || req.body[f] === '');
    if (missing.length) {
      return res.status(400).json({ message: `Campos obrigatórios ausentes: ${missing.join(', ')}` });
    }
    next();
  };
}
```

---

## 7) Routes — `src/routes/user.routes.js`

```js
// src/routes/user.routes.js
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

// POST /users - cria usuário
router.post('/', requireFields(['name', 'email', 'password']), UserController.create);

// GET /users - lista usuários
router.get('/', UserController.list);

// GET /users/:id - obtém usuário por id
router.get('/:id', UserController.getById);

// PATCH /users/:id - atualiza nome/senha
router.patch('/:id', UserController.update);

// DELETE /users/:id - remove usuário
router.delete('/:id', UserController.remove);

export default router;
```

---

## 8) App e Server

### `src/app.js`

```js
// src/app.js
import express from 'express';
import userRoutes from './routes/user.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

// middleware de erro por último
app.use(errorMiddleware);

export default app;
```

### `src/server.js`

```js
// src/server.js
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const { PORT = 3000, DATABASE_URI } = process.env;

await connectDB(DATABASE_URI);

app.listen(PORT, () => {
  console.log(`🚀 HTTP server on http://localhost:${PORT}`);
});
```

---

## 9) Teste rápido (cURL)

```bash
# criar usuário
curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"123456"}' | jq

# listar
curl -s http://localhost:3000/users | jq

# buscar por id
curl -s http://localhost:3000/users/<ID_AQUI> | jq

# atualizar (trocar nome e/ou senha)
curl -s -X PATCH http://localhost:3000/users/<ID_AQUI> \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada L.","password":"nova123"}' | jq

# apagar
curl -s -X DELETE http://localhost:3000/users/<ID_AQUI> | jq
```

> Dica: use `jq` apenas se tiver instalado; caso contrário, remova o `| jq`.


---