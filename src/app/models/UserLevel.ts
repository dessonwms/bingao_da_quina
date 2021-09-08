import db from '../../config/db';

const UserModelLevel = {
  all() {
    const query = `
    SELECT * FROM user_level WHERE id = $1 OR id = $2
      `;

    const values = [2, 3];

    return db.query(query, values);
  },
};

export default UserModelLevel;
