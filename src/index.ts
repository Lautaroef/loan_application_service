import express from 'express';
import rateLimit from 'express-rate-limit';

require('dotenv').config();
import sequelize from './database/config';
import authRoutes from './routes/authRoutes';
import loanApplicationRoutes from './routes/loanApplicationRoutes';

const app = express();
const port = process.env.PORT || 3000;

/*
Core Features:
- POST /applications
- GET /applications/{id}
- GET /applications

Database Schema and ORM:
- Tables for LoanApplications, Users, and Roles
- Integrate Sequelize with models

Authentication and Authorization:
- POST /auth/register
- POST /auth/login: Allow users to login and manage JWT token
- Middleware for JWT token verification - middleware/verifyToken.ts
- Middleware for role-based access control for distinguishing between Admin and Applicant users - middleware/roleCheck.ts

Security measures:
- Used DB_NAME, DB_PASSWORD and JWT_SECRET from environment variables
- Implement password hashing and salting using `bcrypt`
- Implement input validation using `express-validator`
- Implement rate limiting for login attempts 

Docker integration
- Create a Dockerfile for the application
- Create a `docker-compose.yml` file to run the app and postgres database together
*/

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 5 minutes'
});

app.use(express.json());
app.use(loginLimiter);
app.use('/api', authRoutes);
app.use('/api', loanApplicationRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ force: false }); // Set force to true only if you want to drop and recreate the tables
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

// TODO: move validation to a separate file
