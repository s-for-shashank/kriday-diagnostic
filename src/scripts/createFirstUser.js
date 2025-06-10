import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createFirstUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('kriday');
    const users = db.collection('users');
    
    // Check if any admin user already exists
    const existingAdmin = await users.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      return;
    }
    
    // User details for first admin - CUSTOMIZE THESE VALUES
    const adminUser = {
      name: 'Kriday Admin',
      email: 'admin@kriday.com', // Change to your email
      password: 'KridayAdmin@2024!', // Change to a secure password
      role: 'admin'
    };
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    
    // Create the user
    const result = await users.insertOne({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
    
    console.log('🎉 First admin user created successfully!');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log(`   User ID: ${result.insertedId}`);
    console.log('');
    console.log('🔒 Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
createFirstUser().catch(console.error);