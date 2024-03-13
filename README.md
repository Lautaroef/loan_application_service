# Enhanced Loan Application Processing Service

### Overview
This microservice manages loan applications, allowing for submission, status checks, and admin management. It includes features like user authentication and role-based access control.

## Getting started
### Prerequisites
- Docker and Docker Compose
- Node.js (if running locally without Docker)
- PostgreSQL (if running locally without Docker)

### Run with Docker
```
# Create .env file from .env.template
cp .env.template .env
# Set up environment variables

# Run docker from root directory
docker-compose up

# App should be live at http://localhost:3000/
```

### Run Locally (without Docker)
1. Make sure PostgreSQL is installed, or download it from the [official website](https://www.postgresql.org/download/)
2. Connect to your PostgreSQL with a superuser and create an user:
```bash
CREATE USER <username> WITH ENCRYPTED PASSWORD '<mypassword>';

CREATE DATABASE loan_company;

# Grant privileges to your user
GRANT ALL PRIVILEGES ON DATABASE loan_company TO <username>;
GRANT ALL PRIVILEGES ON SCHEMA public TO <username>;
```
3. Set up `.env` file from .env.template. Fill in your DB user and password.
4. Run `npm install` from the root directory.
5. Start the app with `npm run dev`.

### Understanding the Data Model
The database consists of three tables: users, roles, and loan applications.
- **User**: Users registered in the system.
- **Role**: Roles that can be assigned to users. The system creates one 'admin' and one 'applicant' user.
- **LoanApplication**: Loan applications submitted by users. Applicants can only GET their own applications. Admins can see everyone's applications.
> Upon successful login, a middleware is used to set `req.user`, for later comparing the `req.user.userId` with the `req.params.id`

**Roles** define what a user can do. There are two roles:
- **Admin**: Users who can see all the loan applications that have been submitted.
- **Applicant**: Someone who wants to apply for a loan.

Admins can login and see all loan applications. Users with role `applicant` can only see their own applications.

### Register and Login into the system
To start using the app, you would need an API testing program, such as **POSTMAN**. Then start hitting `http://localhost:3000/api/`.

- Register using the **POST /api/auth/register** endpoint. It creates a user with role `applicant`. Accepts a body like:
```json
{
  "username": "user",
  "password": "pass",
}
```
Returns: 
```json
{
    "message": "User registered successfully",
    "userId": 3
}
```

- Login using the **POST `/api/auth/login`** endpoint. Accepts a body like:
```json
{
  "username": "user",
  "password": "pass"
}
```

- You will receive a `token` use it for setting the `Bearer <token>` on the `Auth` tab of Postman.
   
### Start creating loans
#### Loan Application Management
- **Submit a Loan Application** - POST /api/applications
Submit a new loan application. **Requires JWT authentication.**
It uses the `req.user.id` defined in the middleware for setting the `applicantId`.
```json
{
  "amount": 10000.50,
  "term": 12,
}
```
Returns: Details of the submitted application.

- **GET a Loan Application** - GET /api/applications/{id}
Requires JWT authentication.
If you have specified a `token` of an `applicant` user, you can only access `loanApplications`'s where the `applicationId` is equal to the `userId` (defined thanks to the JWT token).
Otherwise if you login with an admin token you can list all `loanApplication`'s

Retrieves a specific loan application details. 
```json
{
    "id": 1,
    "applicantId": 3,
    "status": "pending",
    "amount": 10000.50,
    "term": 12,
}
```

- **Retrieve All Loan Applications (Admin Only)** - GET /api/applications
Requires JWT authentication and be logged in with an admin token.
Admin-only endpoint to retrieve all loan applications.
Returns: List of all loan applications.
```json
[
    {
      "id": 1,
      "applicantId": 3,
      "status": "pending",
      "amount": 10000.50,
      "term": 12,
  },
  {
      "id": 2,
      "applicantId": 4,
      "status": "pending",
      "amount": "2000.00",
      "term": 1,
  },
...
]
```

### Security Features
- Passwords are hashed using `bcrypt` before storage.
- Input validation and sanitization are implemented to prevent injection attacks (using `express-validator`).
- Rate limiting is applied to all endpoints to prevent brute-force attacks (using `express-rate-limit`).

### Types
Add necessary types to `types.d.ts`
