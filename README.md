<h1 align="center">
  <img alt="FastFeet" height="215" title="FastFeet" src=".github/logo.svg" />
</h1>

<p align="center">Desafio do Bootcamp GoStack 10.0</p>

<strong>Desafios:</strong>

- [Etapa 1](https://github.com/EliasGcf/fastfeet/blob/master/server/ETAPA_01.md)
- [Etapa 2](https://github.com/EliasGcf/fastfeet/blob/master/server/ETAPA_02.md)
- [Etapa 3](https://github.com/EliasGcf/fastfeet/blob/master/web/ETAPA_03.md)
- [Etapa 4](https://github.com/EliasGcf/fastfeet/blob/master/mobile/ETAPA_04.md)

## Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [Express](https://github.com/expressjs/express)
- [Redis](https://redis.io/)
- [Bee-Queue](https://github.com/bee-queue/bee-queue)
- [PostgreSQL](https://www.postgresql.org/)
- [MongoDB](https://www.mongodb.com/)


## Instalação e execução

Arquivo `Insomnia.json` disponível no pacote;


### Backend

- A partir da raiz do projeto, entre na pasta rodando `cd server`;
- `yarn` para instalar sua dependências;
- `cp .env.example .env` e preencha o arquivo `.env` com as variáveis ambiente;
- `yarn sequelize db:migrate` para executar as migrations;
- Para executar somente a migration de `admin-user` rode o comando `yarn sequelize db:seed:all;
- `yarn dev` para iniciar o servidor;

### Web



- A partir da raiz do projeto, entre na pasta da aplicação web rodando `cd web`;
- `yarn` para instalar as dependências;
- `yarn start` para iniciar o client;

### Mobile

Obs.: Testado apenas no IOS.

- A partir da raiz do projeto, entre na pasta da aplicação mobile rodando `cd mobile`;
- `yarn` para instalar as dependências;
- Edite o arquivo `mobile/src/services/api.js`, alterando `baseURL` para o IP correspondente ao servidor `server`;
- `yarn react-native run-ios` para iniciar o emulador IOS;
