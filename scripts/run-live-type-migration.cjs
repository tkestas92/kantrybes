#!/usr/bin/env node
const fs = require('fs')
const mysql = require('mysql2/promise')

async function main() {
  const sql = fs.readFileSync('migrations/012_add_live_type.sql', 'utf8')
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: process.env.MYSQL_HOST?.includes('rlwy.net')
      ? { rejectUnauthorized: false }
      : undefined,
    multipleStatements: false,
  })

  for (const statement of statements) {
    try {
      await conn.query(statement)
      console.log('OK:', statement.split('\n')[0].slice(0, 80))
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('SKIP: live_type column already exists')
        continue
      }
      throw err
    }
  }

  await conn.end()
  console.log('Migration complete')
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
