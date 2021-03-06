import db from '../../config/db';

const ReportModel = {
  checkForRecords(bingoId: any) {
    return db.query(`
      SELECT * FROM winners
      WHERE bingo_id = ${bingoId}
    `);
  },
  async saveDataWinner(dataWinner: any) {
    try {
      const query = `
      INSERT INTO winners (
        bingo_id,
        user_id,
        betting_id,
        number_hits
    ) VALUES ( $1, $2, $3, $4 )
    RETURNING id
    `;

      const values = [
        dataWinner.bingoId,
        dataWinner.userId,
        dataWinner.bettingId,
        dataWinner.numberHits,
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },
  async updateDataWinner(dataWinner: any, fields: any) {
    let query = 'UPDATE winners SET';

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `;
      } else {
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE bingo_id = ${dataWinner.bingoId}
          AND user_id = ${dataWinner.userId}
          AND betting_id = ${dataWinner.bettingId}
        `;
      }

      return true;
    });

    await db.query(query);
  },
  onlyWinners(bingoId: any) {
    return db.query(`
      SELECT
              win.*,
              bts.*,
              usr.name,
              (SELECT MIN(number_hits) FROM winners WHERE bingo_id = ${bingoId} ) AS minimo
      FROM winners win
        INNER JOIN users usr ON win.user_id = usr.id
        INNER JOIN bettings bts ON win.betting_id = bts.id
      WHERE win.bingo_id = ${bingoId}
        AND number_hits = 10
        OR number_hits = 9
        OR number_hits = (SELECT MIN(number_hits) FROM winners WHERE bingo_id = ${bingoId} )
      ORDER BY number_hits DESC
    `);
  },
  rankingHome(bingoId: any) {
    return db.query(`
      SELECT
            number_hits,
            count(number_hits),
            (SELECT MIN(number_hits) FROM winners WHERE bingo_id = ${bingoId} ) AS minimo,
            (SELECT COUNT(*) FROM bettings WHERE bingo_id = ${bingoId} ) AS totalbets
      FROM winners win
        INNER JOIN bettings bts ON win.betting_id = bts.id
      WHERE win.bingo_id = ${bingoId}
      GROUP BY number_hits
      ORDER BY number_hits DESC
    `);
  },
  async totalRegister(fields: any) {
    try {
      const query = `SELECT COUNT(*)
      FROM ${fields.table}
      WHERE bingo_id = ${fields.bingoId}`;

      const results = await db.query(query);
      return results.rows[0];
    } catch (err) {
      return `Error: ${err}`;
    }
  },
};

export default ReportModel;
