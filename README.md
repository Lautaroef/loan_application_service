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

## Understanding the Data Model
The database consists of three tables: users, roles, and loan applications.
- **Users**: Individuals registered in the system.
- **Roles**: Defines the access level within the system, with two primary roles:
  - **Admin**: Users who can view all loan applications.
  - **Applicant**: Users who can apply for loans and view their applications.
- **Loan Applications**: Requests for loans submitted by applicants.

Admins can login and see all loan applications. Users with role `applicant` can only see their own applications.

### Register and Login into the system
Use an API testing tool like Postman to interact with the endpoints at `http://localhost:3000/api/`.

- **Register a User** (POST `/api/auth/register`)
Creates a user with the `applicant` role.
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

- **Login User** (POST `/api/auth/login`)
```json
{
  "username": "user",
  "password": "pass"
}
```
Use the returned token for setting the `Bearer <token>` for subsequent requests.

### Loan Application Management
### Submit a Loan Application
> When trying to access private resources, a middleware is used to set the `req.user`, which can be later accessed inside controllers to access the `userId` and `role` of the user making the request.

(POST `/api/applications`) Submit a new loan application. Requires JWT authentication.

> It uses the `req.user.id` defined in the middleware for setting the `applicantId` of the `LoanApplication` model.
> 
```json
{
  "amount": 10000.50,
  "term": 12,
}
```
Returns details of the submitted application.
### GET a Loan Application
(GET `/api/applications/{id}`) Retrieve a specific loan application. Requires JWT authentication.

> If you have specified a `token` of an `applicant` user, you can only access `loanApplications`'s where the `applicationId` is equal to the `req.user.userId` defined by the auth middleware. Otherwise, if you login with an admin user you can list all `loanApplication`'s

```json
{
    "id": 1,
    "applicantId": 3,
    "status": "pending",
    "amount": 10000.50,
    "term": 12,
}
```

### Retrieve All Loan Applications (Admin Only)
(GET `/api/applications`) Admin-only endpoint to retrieve all loan applications. Requires JWT authentication.

```json
[
    {
      "id": 1,
      "applicantId": 3,
      "status": "pending",
      "amount": 10000.50,
      "term": 12,
  },
  ...
]
```

### Security Features
- Passwords are hashed using `bcrypt`.
- Input validation and sanitization prevent injection attacks (using `express-validator`).
- Rate limiting is applied to all endpoints to prevent brute-force attacks (using `express-rate-limit`).

### Types
Extend Express `Request` object in `types.d.ts` to include user authentication details.
