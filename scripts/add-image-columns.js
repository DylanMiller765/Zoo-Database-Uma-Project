// Quick script to add image_url columns to the database
// Run with: node scripts/add-image-columns.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function runMigration() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database');

    const migrations = [
      "ALTER TABLE `animals` ADD COLUMN `image_url` LONGTEXT NULL AFTER `weight`",
      "ALTER TABLE `habitats` ADD COLUMN `image_url` LONGTEXT NULL AFTER `last_maintenance`",
      "ALTER TABLE `events` ADD COLUMN `image_url` LONGTEXT NULL AFTER `ticket_price`",
      "ALTER TABLE `gift_shop_items` ADD COLUMN `image_url` LONGTEXT NULL AFTER `supplier`",
      "ALTER TABLE `cafe_items` ADD COLUMN `image_url` LONGTEXT NULL AFTER `price`",
    ];

    for (const sql of migrations) {
      try {
        await connection.execute(sql);
        console.log(`✅ ${sql.split('`')[1]} table updated`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column already exists in ${sql.split('`')[1]} table, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();

