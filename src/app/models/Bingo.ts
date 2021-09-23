import db from '../../config/db';

const BingoModel = {
  all() {
    return db.query(`
    SELECT * FROM bingos
    ORDER BY updated_at DESC
    `);
  },
  async find(id: any) {
    return db.query('SELECT * FROM bingos WHERE id = $1', [id]);
  },
  async create(data: any, userId: any) {
    try {
      const query = `
      INSERT INTO bingos (
        edition,
        start_date,
        status,
        released_bets,
        user_id
    ) VALUES ( $1, $2, $3, $4, $5 )
    RETURNING id
    `;

      const values = [data.edition, data.start_date, 'ATIVO', 'B', userId];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },
  async findActive() {
    return db.query('SELECT * FROM bingos');
  },
  async update(id: any, fields: any) {
    let query = 'UPDATE bingos SET';

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `;
      } else {
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
        `;
      }

      return true;
    });

    await db.query(query);
  },
  async selectLast(data: any) {
    try {
      const query = `SELECT ${data.fields} FROM ${data.table}
          ORDER BY ${data.orderField} ${data.order}
          LIMIT ${data.limit}`;

      const results = await db.query(query);
      return results.rows[0];
    } catch (err) {
      return `Error: ${err}`;
    }
  },
};

export default BingoModel;
