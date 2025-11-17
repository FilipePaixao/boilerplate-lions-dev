import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseDatabase } from '../../jest/setup-db.js';
import { app } from './configApp.js';

export async function bootstrapTest() {
  const mongoServer = await MongoMemoryServer.create();
  const DATABASE_URI = mongoServer.getUri();
  const DB_NAME = `integration-tests-${Date.now()}`;
  const dbInstance = new MongooseDatabase(DATABASE_URI, DB_NAME);

  await dbInstance.start();

  return {
    dbInstance,
    app,
    mongoServer,
  };
}
