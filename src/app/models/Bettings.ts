import db from '../../config/db';

const BetsModel = {
  all(bingoId: any) {
    return db.query(`
    SELECT * FROM bettings
    WHERE bingo_id = ${bingoId}
    ORDER BY updated_at DESC
    `);
  },
  async create(data: any, sellerId: any) {
    try {
      const query = `
      INSERT INTO bettings (
        user_id,
        bingo_id,
        seller_id,
        first_ten,
        second_ten,
        third_ten,
        forth_ten,
        fifth_ten,
        sixth_ten,
        seventh_ten,
        eighth_ten,
        ninth_ten,
        tenth_ten,
        payment_status,
        quota
    ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 )
    RETURNING id
    `;

      const values = [
        data.userId,
        data.bingoId,
        sellerId,
        data.number[0],
        data.number[1],
        data.number[2],
        data.number[3],
        data.number[4],
        data.number[5],
        data.number[6],
        data.number[7],
        data.number[8],
        data.number[9],
        data.payment_status,
        data.quota,
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },
  delete(id: any) {
    return db.query('DELETE FROM bettings WHERE id = $1', [id]);
  },
  searchBetsByBettor(bingoId: any, punterId: any) {
    return db.query(`
    SELECT * FROM bettings
    WHERE user_id = ${punterId}
    AND bingo_id = ${bingoId}
    ORDER BY updated_at ASC
    `);
  },
  async paginate(params: any) {
    const { bingoId, limit, offset, callback } = params;

    const query = `SELECT
                          bts.id AS bts_id,
                          bts.first_ten, bts.second_ten, bts.third_ten, bts.forth_ten, bts.fifth_ten,
                          bts.sixth_ten, bts.seventh_ten, bts.eighth_ten, bts.ninth_ten, bts.tenth_ten,
                          win.id AS win_id, win.number_hits,
                          usr.name, usr.surname,
                          (SELECT count(*) FROM bettings WHERE bingo_id = ${bingoId}) AS total
                  FROM bettings bts
                    INNER JOIN winners win ON win.betting_id = bts.id
                    INNER JOIN users usr ON bts.user_id = usr.id
                  WHERE bts.bingo_id = ${bingoId}
                  ORDER BY win.number_hits DESC, usr.name ASC
                  LIMIT $1
                  OFFSET $2`;

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw new Error('Database Error!');

      callback(results.rows);
    });
  },
  async summaryPdf(bingoId: any) {
    return db.query(`
    SELECT
          bts.id AS bts_id,
          bts.first_ten, bts.second_ten, bts.third_ten, bts.forth_ten, bts.fifth_ten,
          bts.sixth_ten, bts.seventh_ten, bts.eighth_ten, bts.ninth_ten, bts.tenth_ten,
          win.id AS win_id, win.number_hits,
          usr.name, usr.surname,
          (SELECT count(*) FROM bettings WHERE bingo_id = ${bingoId}) AS total
    FROM bettings bts
      INNER JOIN winners win ON win.betting_id = bts.id
      INNER JOIN users usr ON bts.user_id = usr.id
    WHERE bts.bingo_id = ${bingoId}
    ORDER BY win.number_hits DESC, usr.name ASC
    `);
  },
  async findPunter(bettingId: any) {
    return db.query(`
      SELECT
          bts.*,
          usr.name, usr.surname, usr.phone
      FROM bettings bts
          INNER JOIN users usr ON bts.user_id = usr.id
      WHERE bts.id = ${bettingId}
    `);
  },
  async update(id: any, fields: any) {
    let query = 'UPDATE bettings SET';

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

export default BetsModel;
