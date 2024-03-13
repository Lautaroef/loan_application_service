import express from 'express';
import type { Request, Response } from 'express';

import LoanApplication from '../database/models/LoanApplication';

import adminRoleCheck from '../middleware/roleCheck';
import verifyToken from '../middleware/verifyToken';

import { body, validationResult } from 'express-validator';

const router = express.Router();

// Anyone can use these routes
router.post(
  '/applications',
  verifyToken,
  [
    // TODO: move validation to a separate file
    body('amount')
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Amount must be a valid decimal'),
    body('term').isInt({ min: 1 }).withMessage('Term must be a positive integer')
  ],
  async (req: Request, res: Response) => {
    // Validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, term } = req.body;
    const applicantId = req.user.userId;

    try {
      const application = await LoanApplication.create({
        applicantId,
        amount,
        term,
        status: 'pending'
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get('/applications/:id', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const applicationId = req.params.id;

  try {
    const application = await LoanApplication.findByPk(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the logged-in user is the owner of the application or if the user is an admin
    if (application.applicantId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admins only
router.get('/applications', verifyToken, adminRoleCheck, async (req, res) => {
  try {
    const applications = await LoanApplication.findAll({});
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
