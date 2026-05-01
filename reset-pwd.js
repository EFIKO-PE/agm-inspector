const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://neondb_owner:npg_MYcR1zfPl9oD@ep-solitary-unit-ami9niqc.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function resetPassword() {
  const email = 'Kenior2001aea@gmail.com';
  const newPassword = '74882759';
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE "User" SET password = ${hashedPassword} WHERE email = ${email}`;
    console.log('✅ ¡Contraseña reseteada con éxito para:', email);
  } catch (err) {
    console.error('❌ Error al resetear:', err);
  }
}

resetPassword();
