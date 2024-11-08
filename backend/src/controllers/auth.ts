import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, writeDb } from '../db.js';

const ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
const REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET';

// Define a User type for better type safety
type User = {
  id: string;
  email: string;
  password: string;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = await getDb();

    const users: User[] = db.users;
    const user = users.find((user) => user.email === email);

    if (user) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = { id: uuidv4(), email, password: hashedPassword };
    users.push(newUser);
    await writeDb();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = await getDb();

    const users: User[] = db.users;
    const user = users.find((user) => user.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.json({ accessToken, refreshToken });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers['x-access-token'] as string;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    res.json({ id: (decoded as jwt.JwtPayload).id });
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers['x-refresh-token'] as string;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const accessToken = jwt.sign({ id: (decoded as jwt.JwtPayload).id }, ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    res.json({ accessToken });
  });
};
