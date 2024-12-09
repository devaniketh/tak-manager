import { Router, Request, Response } from 'express';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    res.json({ message: 'User registered successfully', user: { name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  res.json({ message: 'User logged in successfully', token: 'some-jwt-token' });
});

export default router;
