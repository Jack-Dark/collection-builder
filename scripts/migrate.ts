import { migrate } from 'drizzle-orm/neon-serverless/migrator';

import { db } from '#/api/db';
import { configs } from '#/configs';

const runMigration = async () => {
  if (!configs.dbUrl) {
    throw new Error('DATABASE_URL environment variable is missing');
  }

  try {
    console.log('⏳ Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
