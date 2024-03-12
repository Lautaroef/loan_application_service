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
  [
    // TODO: move validation to a separate file
    body('amount')
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Amount must be a valid decimal'),
    body('term').isInt({ min: 1 }).withMessage('Term must be a positive integer'),
    body('applicantId').isNumeric().withMessage('Applicant ID must be a number')
  ],
  async (req: Request, res: Response) => {
    // Validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, term } = req.body;
    const applicantId = req.body.user.id;

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

router.get('/applications/:id', async (req, res) => {
  try {
    const application = await LoanApplication.findByPk(req.params.id);
    if (application) {
      res.json(application);
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admins only
router.get('/applications', verifyToken, adminRoleCheck, async (req, res) => {
  try {
    const applications = await LoanApplication.findAll();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
