// scripts/create-admin.mjs
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local if not already in process.env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'trianyaa';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local or environment.');
  process.exit(1);
}

const email = (process.argv[2] || 'admin@gmail.com').toLowerCase().trim();
const password = process.argv[3] || 'admin12345';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
  try {
    console.log(`Connecting to MongoDB (${MONGODB_DB_NAME})...`);
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('✅ Connected to MongoDB.');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          passwordHash,
          role: 'admin',
          name: 'Admin',
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    console.log(`\n🎉 Admin user successfully configured!`);
    console.log(`----------------------------------------`);
    console.log(`Email:    ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${user.role}`);
    console.log(`----------------------------------------`);
    console.log(`You can now log in at /auth/login\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    process.exit(1);
  }
}

main();
