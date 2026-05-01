import sql from './src/lib/db.js';

async function migrate() {
  try {
    console.log("Añadiendo columna isActive a la tabla User...");
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT TRUE;`;
    console.log("¡Migración completada con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error en la migración:", err);
    process.exit(1);
  }
}

migrate();
