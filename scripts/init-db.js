// Paleidi su: npm run db:init
// Nuskaito schema.sql ir paleidžia per MySQL konekciją iš .env.local
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: process.env.MYSQL_HOST?.includes('railway')
      ? { rejectUnauthorized: false }
      : undefined,
    multipleStatements: true,
  })

  const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8')

  console.log('Vykdoma schema.sql...')
  await connection.query(sql)
  console.log('✅ DB inicializuota sėkmingai!')

  await connection.end()
}

main().catch(err => {
  console.error('❌ Klaida:', err.message)
  process.exit(1)
})
