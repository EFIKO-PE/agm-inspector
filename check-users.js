const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = 'postgresql://neondb_owner:npg_MYcR1zfPl9oD@ep-solitary-unit-ami9niqc.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function check() {
  try {
    const users = await sql`SELECT email FROM "User"`;
    console.log('--- USUARIOS ENCONTRADOS ---');
    users.forEach(u => console.log('- ' + u.email));
    console.log('----------------------------');
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
