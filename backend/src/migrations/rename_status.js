import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for migration...');

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // 1. Rename 'status' to 'deliveryStatus'
    // Note: $rename works even if the field doesn't exist (it just does nothing)
    // But we check for existence to report accurate counts
    const docsToRename = await ordersCollection.countDocuments({ status: { $exists: true } });
    console.log(`Found ${docsToRename} documents with 'status' field.`);

    const renameResult = await ordersCollection.updateMany(
      { status: { $exists: true } },
      { $rename: { status: 'deliveryStatus' } }
    );
    console.log(`Renamed 'status' to 'deliveryStatus' in ${renameResult.modifiedCount} documents.`);

    // 2. Unset any 'paymentStatus' (if it existed)
    const unsetResult = await ordersCollection.updateMany(
      {},
      { $unset: { paymentStatus: "" } }
    );
    console.log(`Removed 'paymentStatus' from ${unsetResult.modifiedCount} documents.`);

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
