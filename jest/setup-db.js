import mongoose from 'mongoose';

export class MongooseDatabase {
  constructor(DB_URI, DB_NAME) {
    this.DB_URI = DB_URI;
    this.DB_NAME = DB_NAME;
    this.DB_CONNECTION = undefined;

    mongoose.connection?.once('open', () => {
      console.info('Connection established - MongoDB');
    });

    mongoose.connection?.on('error', (err) => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
    });
  }

  async start() {
    if (!this.DB_CONNECTION) {
      await mongoose.connect(this.DB_URI, { dbName: this.DB_NAME });
      this.DB_CONNECTION = mongoose.connection;
    }
  }

  async close() {
    this.DB_CONNECTION?.close();
    this.DB_CONNECTION = undefined;
  }
}
