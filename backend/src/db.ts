import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import _ from 'lodash';

interface Data {
  users: Array<{ id: string; email: string; password: string }>;
}

// Setup the database
const adapter = new JSONFile<Data>('db.json');
const db = new Low<Data>(adapter, { users: [] });

// Initialize the database with default values
async function initializeDb() {
  try {
    await db.read();
    db.data ||= { users: [] }; 
    await db.write();
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
}

// Initialize the database immediately
initializeDb(); 

// Ensure database is initialized before reading
export const getDb = async () => {
  await initializeDb();
  await db.read();
  return _.chain(db.data).value(); 
};

export const writeDb = async () => {
  await db.write();
};
