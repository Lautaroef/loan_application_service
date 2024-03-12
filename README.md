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
2. Connect to your PostgreSQL with a superuser. If you don’t have a dedicated user for the application, you can create one by:
```bash
CREATE USER <username> WITH ENCRYPTED PASSWORD '<mypassword>';

CREATE DATABASE loan_company;

# Grant privileges to your user
GRANT ALL PRIVILEGES ON DATABASE loan_company TO <username>;
```
3. Set up `.env` file from .env.template. Fill in your DB user and password.
4. Run `npm install` from the root directory.
5. Start the app with `npm run dev`.

### How it works
The API allows users to login and create a loan. Admins can login and see all loan applications.


#### User Management

- **Register a User** - POST /api/auth/register
Registers a new user.
```json
{
  "body": {
    "username": "user",
    "password": "pass",
    "role": "applicant"
  }
}
```
Returns: User registration confirmation.

- **Login User** - POST /api/auth/login
Authenticates the user and returns a JWT token.
```json
{
  "body": {
    "username": "user",
    "password": "pass"
  }
}
```
Returns: JWT token.

#### Loan Application Management
- **Submit a Loan Application** - POST /api/applications
Submits a new loan application. Requires JWT authentication.
```json
{
  "headers": {
    "Authorization": "Bearer <JWT Token>"
  },
  "body": {
    "applicantId": 1,
    "amount": 10000.50,
    "term": 12,
  }
}
```
Returns: Details of the submitted application.

- **GET a Loan Application** - GET /api/applications/{id}
Retrieves a specific loan application. Requires JWT authentication.
```json
  "headers": {
    "Authorization": "Bearer <JWT Token>"
  }
```
Returns: Loan application details.

- **Retrieve All Loan Applications (Admin Only)** - GET /api/applications
Admin-only endpoint to retrieve all loan applications. Requires JWT authentication.
```json
  "headers": {
    "Authorization": "Bearer <JWT Token>"
  }
```
Returns: List of all loan applications.

### Authentication and Authorization
- Users can register as `applicant` or `admin`.
- Endpoints require JWT for authentication, provided in the Authorization header.
- Role-based access control is enforced; only admins can view all loan applications.

### Security Features
- Passwords are hashed using `bcrypt` before storage.
- Input validation and sanitization are implemented to prevent injection attacks (using `express-validator`).
- Rate limiting is applied to all endpoints to prevent brute-force attacks (using `express-rate-limit`).
