import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Create Prisma client instance
const prisma = new PrismaClient();

// Extend Express Request type to include user property after authentication
interface CustomRequest extends Request {
  user?: { userId: number }; // User information after authentication
}

// Middleware to authenticate users via JWT
const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Initialize Express router
const router = express.Router();

// Apply authentication middleware globally on all routes in this router


// Create a new task
router.post('/', async (req: CustomRequest, res: Response) => {
  const { title, description } = req.body;
  const { userId } = req.user!; // User information is available from authenticate middleware

  try {
    // Create a task associated with the authenticated user
    const task = await prisma.task.create({
      data: { title, description, userId },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get tasks for the authenticated user
router.get('/', async (req: CustomRequest, res: Response) => {
  const { userId } = req.user!; // Get userId from authenticated user

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update a task
router.put('/:id', async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
