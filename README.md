
## Description

Welcome to StarWars test project.
It's an NestJS backend application that provides a RESTful API for managing characters from the Star Wars universe.
The application allows users to create, read, update, and delete character records, as well as search for characters by name.

## Swagger

To view the API documentation, navigate to `http://localhost:3002/api` after starting the server. The Swagger UI provides an interactive interface for testing the API endpoints.


## Project setup

Enter the project directory and copy the .env file:
```bash
$ cp .env.example .env
```

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

# test coverage
$ npm run test:cov
```
