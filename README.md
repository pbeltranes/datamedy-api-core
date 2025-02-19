<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project Setup

### Install Dependencies

```bash
pnpm install
```

### Compile and Run the Project

```bash
# Development mode
pnpm run start

# Watch mode
pnpm run start:dev

# Production mode
pnpm run start:prod
```

### Run Tests

```bash
# Unit tests
pnpm run vitest

# Test coverage
pnpm run vitest:coverage
```

## Deployment

To deploy your NestJS application to production efficiently, follow the [deployment documentation](https://docs.nestjs.com/deployment).

If you're looking for a cloud-based platform for deployment, check out [Mau](https://mau.nestjs.com), the official NestJS deployment platform for AWS. It simplifies deployment into just a few steps.

## Project Structure

- **Controllers**: Handle incoming requests and return responses.
- **Services**: Manage business logic and interact with entities.

## Database Setup

### Install PostgreSQL

#### macOS (Homebrew)

1️⃣ Update Homebrew and install PostgreSQL:

```bash
brew update
brew install postgresql
```

2️⃣ Start and enable PostgreSQL:

```bash
brew services start postgresql
```

3️⃣ Verify the installation:

```bash
postgres --version
```

### Initialize Local Database

Run the setup script:

```bash
bin/setup_local_db.sh
```

### Database Configuration

```bash
# Local database setup
DB_NAME=local_datamedy
DB_USER=paul
DB_PASSWORD=123456
DB_PORT=5432
```

Use Prisma to generate the database schema:

```bash
pnpm prisma generate
```

## Authentication

Authentication tokens must be generated on the frontend and can be edited in the `auth` module.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
