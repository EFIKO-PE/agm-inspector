// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import { neon } from '@neondatabase/serverless';

// Conexión directa a Neon usando SQL puro
const sql = neon("postgresql://neondb_owner:npg_MYcR1zfPl9oD@ep-solitary-unit-ami9niqc.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require");

export default sql;
