import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: { userId: number };
}

const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const router = express.Router();

router.post('/', async (req: CustomRequest, res: Response) => {
  const { title, description } = req.body;
  const { userId } = req.user!;

  try {
    const task = await prisma.task.create({
      data: { title, description, userId },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.get('/', async (req: CustomRequest, res: Response) => {
  const { userId } = req.user!;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

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
