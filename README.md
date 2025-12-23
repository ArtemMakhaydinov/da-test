# Express App with JWT Authentication

Express.js application with TypeScript, JWT authentication, CORS enabled for all domains, and MySQL database using Prisma ORM.

## Features

- 🔐 JWT-based authentication (register, login)
- 🌐 CORS configured to allow access from any domain
- 🗄️ MySQL database with Prisma ORM
- 🔒 Protected routes with JWT middleware
- 🛡️ Password hashing with bcryptjs
- 📝 TypeScript for type safety
- 📊 Winston logger for structured logging

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000

# Logging
LOG_LEVEL="info"
```

Replace the `DATABASE_URL` with your MySQL connection string and set a strong `JWT_SECRET`.

### 3. Set Up Database

Generate Prisma Client:

```bash
yarn prisma:generate
```

Run migrations to create the database schema:

```bash
yarn prisma:migrate
```

### 4. Start the Server

**Development mode** (with hot reload):

```bash
yarn dev
```

**Production mode** (build first, then run):

```bash
yarn build
yarn start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Public Routes

- `GET /` - API information
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe" // optional
  }
  ```
- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Protected Routes (require JWT token)

Include the token in the Authorization header: `Authorization: Bearer <token>`

- `GET /api/auth/me` - Get current user info
- `GET /api/protected/profile` - Example protected route
- `GET /api/protected/data` - Another example protected route

## Example Usage

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
.
├── prisma/
│   └── schema.prisma          # Prisma schema with User model
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client configuration
│   │   └── logger.ts          # Winston logger configuration
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   └── protected.ts       # Protected routes examples
│   ├── types/
│   │   └── express.d.ts       # Express type extensions
│   └── server.ts              # Main server file
├── dist/                      # Compiled JavaScript (generated)
├── logs/                      # Log files (generated)
├── .env                       # Environment variables (create this)
├── .env.sample                # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## Scripts

- `yarn dev` - Start the development server with hot reload (using tsx)
- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Run the compiled JavaScript (production)
- `yarn prisma:generate` - Generate Prisma Client
- `yarn prisma:migrate` - Run database migrations
- `yarn prisma:studio` - Open Prisma Studio (database GUI)
