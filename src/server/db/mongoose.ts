import { dbConfig } from '../../config/db.config';
import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private isConnected: boolean;

  private constructor() {
    this.isConnected = false;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    await mongoose.connect(dbConfig.URL);
    this.isConnected = true;
  }
}

const connectDB = async () => {
  const db = Database.getInstance();
  await db.connect();
};

export default connectDB;
