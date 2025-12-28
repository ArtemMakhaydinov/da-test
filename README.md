# Express App with JWT Authentication and File Management

Express.js application with TypeScript, JWT authentication, file upload/download functionality, CORS enabled for all domains, and MySQL database using Prisma ORM.

## Features

- 🔐 JWT-based authentication (signup, signin, refresh token, logout)
- 📁 File upload, download, update, and delete functionality
- 🌐 CORS configured to allow access from any domain
- 🗄️ MySQL database with Prisma ORM
- 🔒 Protected routes with JWT middleware
- 🛡️ Password hashing with bcryptjs
- 📝 TypeScript for type safety
- 📊 Winston logger for structured logging
- 🔄 Refresh token rotation for enhanced security

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://root:@0.0.0.0:3306/da_test"
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="root"
DATABASE_PASSWORD=""  # Optional, can be omitted if no password is set
DATABASE_NAME="dbname"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN_SEC=600

# Server
PORT=3000

# Security
PW_SECRET="super-secret-password-encryption-key-change-this-in-production"

```

Replace the database connection details with your MySQL/MariaDB credentials and set strong `JWT_SECRET` and `PW_SECRET`.

### 3. Set Up Database

For the local development set up MySQL database in the container (it will set user, password and database name according to `.env.sample`):

```bash
docker compose -f docker-compose.dev.yml up
```

Run migrations to create the database schema:

```bash
yarn prisma-migrate-deploy
```

Generate Prisma Client:

```bash
yarn prisma-generate
```

### 4. Start the Server

**Development mode** (with hot reload):

```bash
yarn start:dev
```

**Production mode** (build first, then run):

```bash
yarn nest build
yarn start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Public Routes

- `GET /` - API information and endpoint documentation

**Authentication:**

- `POST /api/auth/signup` - Register a new user (body: `{ login, password }`)
- `POST /api/auth/signin` - Login user (body: `{ login, password }`)
- `POST /api/auth/signin/refresh_token` - Refresh access token (body: `{ refreshToken }`)

### Protected Routes

Include the token in the Authorization header: `Authorization: Bearer <accessToken>`

**Authentication:**

- `GET /api/auth/info` - Get current user information
- `GET /api/auth/logout` - Logout user and invalidate refresh token

**File Management:**

- `POST /api/file/upload` - Upload a new file (header: `x-filename`, body: file stream)
- `GET /api/file/list` - List files with pagination (query: `page`, `limit`)
- `GET /api/file/:id` - Get file metadata by ID
- `PUT /api/file/update/:id` - Update a file by ID (header: `x-filename` optional, body: file stream optional)
- `DELETE /api/file/:id` - Delete a file by ID
- `GET /api/file/download/:id` - Download a file by ID
