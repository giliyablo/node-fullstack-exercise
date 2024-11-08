import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, writeDb } from './db.js'; 

async function addUser(email: string, password: string) {
  const db = await getDb();
  // Check if the user already exists
  const existingUser = db.users.find((user: { email: string }) => user.email === email);
  if (existingUser) {
    throw new Error(`User with email ${email} already exists!`);
  }

  // Check password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), email, password: hashedPassword };

  db.users.push(newUser);
  await writeDb();

  console.log(`User with email ${email} added successfully!`);
}

const email = 'gili.yablonka@gmail.com';
const password = 'GiliTheKing1234';  

addUser(email, password).catch(err => console.error(err));