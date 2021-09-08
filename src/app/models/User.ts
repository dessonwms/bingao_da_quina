import db from '../../config/db';

const UserModel = {
  all() {
    return db.query('SELECT * FROM users WHERE level = $1', [2]);
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
  async create(data: any) {
    try {
      const query = `
      INSERT INTO users (
          name,
          phone,
          email,
          level,
          password
      ) VALUES ( $1, $2, $3, $4, $5 )
      RETURNING id
      `;

      const values = [
        data.name,
        data.phone,
        data.email,
        data.level,
        '$2a$08$eeUfUqZd/cPDW80kl9mb6uZpVhEy8J0MqA4HU5vEbFr8R2BVHjpaa',
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
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
};

export default UserModel;
