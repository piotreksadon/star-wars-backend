
## Description

Welcome to StarWars test project.
It's an NestJS backend application that provides a RESTful API for managing characters from the Star Wars universe.
The application allows users to create, read, update, and delete character records, as well as search for characters by name.

## Project setup

Install dependencies:

```bash
$ npm install
```

Run dockerized database:
```bash
$ docker-compose up
```

Run migrations to set up your database schema:
```bash
$ npm run migration:up
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
