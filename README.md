
### Responsabilidades por Camada

- `src/models`: descreve a estrutura dos dados e regras de validação básicas de cada entidade (ex.: `user.model.js`).
- `src/controllers`: recebe requisições HTTP, chama os serviços apropriados e envia respostas com status/payload adequados (ex.: `user.controller.js`).
- `src/services`: concentra a lógica de negócio, orquestrando regras, integrações e chamadas ao(s) repositório(s) (ex.: `user.service.js`).
- `src/repositories`: abstrai o acesso a fontes de dados (bancos, APIs, caches) expondo métodos CRUD dedicados (ex.: `user.repository.js`).
- `src/routes`: mapeia endpoints para controllers e aplica middlewares específicos por rota (ex.: `user.routes.js`).
- `src/middlewares`: funções intermediárias do pipeline de requisições, como validação e tratamento de erros (`validate.middleware.js`, `error.middleware.js`).
- `src/config`: configurações compartilhadas, como conexão com banco (`db.js`) e leitura de variáveis de ambiente.
- `src/app.js`: monta a aplicação Express, registrando middlewares globais e todas as rotas exportadas.
- `src/server.js`: inicializa o servidor HTTP, lê porta/variáveis e inicia o listener principal.
- `.env`: armazena variáveis sensíveis (URL do banco, chaves, etc.) sem expô-las no código.
- `package.json`: metadados do projeto, dependências e scripts de execução/teste.
- `README.md`: guia de setup, uso e convenções do projeto.

## Fluxo de Requisição

1. **Rota (`src/routes`)** recebe a requisição e aplica middlewares necessários.
2. **Controller (`src/controllers`)** interpreta os dados recebidos, chama o serviço correspondente e define o status de resposta.
3. **Service (`src/services`)** executa regras de negócio, prepara dados e delega ao repositório quando precisa de persistência.
4. **Repository (`src/repositories`)** interage com o banco/datasource conforme definido em `src/config/db.js`.
5. **Model (`src/models`)** garante a integridade do formato de dados trafegado.
6. **Middlewares globais (`src/middlewares`)** lidam com validação e tratamento uniforme de erros.

## Configuração Inicial

1. Instale dependências (preencha `package.json` com scripts e libs necessárias, ex.: Express, dotenv).
2. Crie um `.env` com as variáveis usadas em `src/config/db.js` (por exemplo `DATABASE_URI` e `PORT`).
3. Implemente a lógica de conexão no `db.js` usando as variáveis do `.env`.
4. Defina rotas e middlewares no `app.js`, exportando a instância da aplicação.
5. No `server.js`, importe o app, leia `process.env.PORT` e chame `app.listen`.

## Próximos Passos Sugeridos

- Preencher cada arquivo com sua implementação inicial (modelos, validações, serviços).
- Adicionar scripts no `package.json` (`start`, `dev`, `test`) e dependências reais do projeto.
- Criar testes unitários/integrados para cada camada à medida que a lógica evoluir.

mkdir -p projeto/src/{models,controllers,services,repositories,routes,middlewares,config} \
  && touch projeto/src/{app.js,server.js} \
  && touch projeto/src/middlewares/{error.middleware.js,validate.middleware.js} \
  && touch projeto/src/config/db.js \
  && touch projeto/src/models/user.model.js \
  && touch projeto/src/controllers/user.controller.js \
  && touch projeto/src/services/user.service.js \
  && touch projeto/src/repositories/user.repository.js \
  && touch projeto/src/routes/user.routes.js \
  && touch projeto/.env projeto/package.json projeto/README.md
