import mysql from 'mysql2/promise'

export type Project = {
  id: number
  title: string
  description: string
  emoji: string
  tags: string[]
  github_url: string | null
  live_url: string | null
  status: 'shipped' | 'in_progress' | 'archived'
  sort_order: number
  created_at: string
  updated_at: string
}

// Singleton connection pool - svarbu, nes Next.js serverless funkcijos
// gali sukurti daug konekcijų jei tas pool nebus pakartotinai naudojamas
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      family: process.env.MYSQL_HOST?.includes('railway.internal') ? 0 : undefined,
      ssl: process.env.MYSQL_HOST?.includes('proxy.rlwy.net')
        ? { rejectUnauthorized: false }
        : undefined,
    })
  }
  return pool
}

// tags saugomi DB kaip JSON string, šitos funkcijos konvertuoja į/iš array
function rowToProject(row: any): Project {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const pool = getPool()
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC')
  return (rows as any[]).map(rowToProject)
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const pool = getPool()
  const [result] = await pool.query(
    `INSERT INTO projects (title, description, emoji, tags, github_url, live_url, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.emoji || '🚀',
      JSON.stringify(data.tags || []),
      data.github_url || null,
      data.live_url || null,
      data.status || 'shipped',
      data.sort_order || 0,
    ]
  )
  const insertId = (result as any).insertId
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [insertId])
  return rowToProject((rows as any[])[0])
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const pool = getPool()
  const fields: string[] = []
  const values: any[] = []

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title) }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description) }
  if (data.emoji !== undefined) { fields.push('emoji = ?'); values.push(data.emoji) }
  if (data.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(data.tags)) }
  if (data.github_url !== undefined) { fields.push('github_url = ?'); values.push(data.github_url) }
  if (data.live_url !== undefined) { fields.push('live_url = ?'); values.push(data.live_url) }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status) }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order) }

  fields.push('updated_at = NOW()')
  values.push(id)

  await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values)
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id])
  return rowToProject((rows as any[])[0])
}

export async function deleteProject(id: number): Promise<void> {
  const pool = getPool()
  await pool.query('DELETE FROM projects WHERE id = ?', [id])
}
