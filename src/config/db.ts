import { Pool } from 'pg';

export default new Pool({
  user: 'postgres',
  password: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'betting_system',
});
