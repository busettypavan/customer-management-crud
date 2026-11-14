# Customer Management CRUD

A small demonstration project with an Express API and a React + Vite frontend.
It uses JavaScript, Drizzle ORM, Turso (libSQL), and Tailwind CSS.

## Requirements

- Node.js 20+
- A Turso database and database auth token
- npm

## 1. Configure Turso

Create a database with the Turso CLI or dashboard. Obtain its database URL and auth token.

The URL usually looks like `libsql://your-database-your-org.turso.io`.

## 2. Start the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=4000
TURSO_DATABASE_URL=libsql://your-database-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

Create the table:

```bash
npm run db:push
```

Insert five sample customers:

```bash
npm run db:seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:4000`. Check `http://localhost:4000/health`.

> `db:push` uses Drizzle Kit to create/update the schema in the configured Turso database. Run it after changing the schema.

## 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Features

- Create a customer
- List all customers
- View customer details
- Update a customer
- Delete a customer
- Responsive Tailwind CSS interface
- Five optional sample records

## API reference

Base URL: `http://localhost:4000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/customers` | Create a customer |
| `GET` | `/customers` | List customers |
| `GET` | `/customers/:id` | Get one customer |
| `PUT` | `/customers/:id` | Update a customer |
| `DELETE` | `/customers/:id` | Delete a customer |

### Customer JSON

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "phone": "+91 9876543210",
  "city": "Bengaluru"
}
```

### API testing examples (curl)

Create:

```bash
curl -X POST http://localhost:4000/api/customers \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Asha Rao\",\"email\":\"asha@example.com\",\"phone\":\"+91 9876543210\",\"city\":\"Bengaluru\"}"
```

List:

```bash
curl http://localhost:4000/api/customers
```

Details (replace `1` with an existing ID):

```bash
curl http://localhost:4000/api/customers/1
```

Update:

```bash
curl -X PUT http://localhost:4000/api/customers/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Asha Rao\",\"email\":\"asha@example.com\",\"phone\":\"+91 9876543210\",\"city\":\"Mysuru\"}"
```

Delete:

```bash
curl -X DELETE http://localhost:4000/api/customers/1
```

## Notes

- Authentication is intentionally omitted to keep the demo focused.
- Do not commit `.env` files or expose your Turso auth token.
- The sample seed script avoids inserting duplicate email addresses.
