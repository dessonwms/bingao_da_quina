import db from '../../config/db';

const PunterModel = {
  all() {
    return db.query(`
    SELECT id, surname, name, phone FROM users
    WHERE id != 1
    ORDER BY updated_at DESC
    LIMIT 10
    `);
  },
  async find(id: any) {
    return db.query('SELECT * FROM users WHERE id = $1', [id]);
  },
  async findOne(filters: any) {
    let query = 'SELECT * FROM users';

    // eslint-disable-next-line array-callback-return
    Object.keys(filters).map(key => {
      // WHERE | OR | AND
      query = `${query} ${key}`;

      // eslint-disable-next-line array-callback-return
      Object.keys(filters[key]).map(field => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);
    return results.rows[0];
  },
  async create(data: any, sellerId: any) {
    try {
      const query = `
      INSERT INTO users (
          name,
          surname,
          phone,
          level,
          seller_id
      ) VALUES ( $1, $2, $3, $4, $5 )
      RETURNING id
      `;

      const values = [
        data.name,
        data.surname,
        data.phone.replace(/\D/g, ''),
        4,
        sellerId,
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },
  async update(id: any, fields: any) {
    let query = 'UPDATE users SET';

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
  async paginate(params: any) {
    const { selectFieldSearch, filter, limit, offset, callback } = params;

    let query = '';
    let filterQuery = '';
    let totalQuery = `(SELECT count(*) FROM users WHERE level != 1) AS total`;

    if (filter) {
      if (selectFieldSearch === 'name') {
        filterQuery = `${query} AND name ILIKE '%${filter}%'`;
      } else if (selectFieldSearch === 'phone') {
        filterQuery = `${query} AND phone ILIKE '${filter}'`;
      }
      totalQuery = ` (SELECT count(*) FROM users WHERE level != 1 ${filterQuery} ) AS total`;
    }

    // SELECT
    // nullif( (select count(*) from users where level != 1 and subscriber_id = 1234), 0) AS count_books,
    // nullif( (select count(*) from selected_media where _type='movie' and subscriber_id = 1234), 0) AS count_movies ;

    query = `SELECT *, ${totalQuery} FROM users WHERE level != 1 ${filterQuery} LIMIT $1 OFFSET $2`;

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw new Error('Database Error!');

      callback(results.rows);
    });
  },
};

export default PunterModel;
