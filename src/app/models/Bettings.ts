import db from '../../config/db';

const BetsModel = {
  async create(data: any, sellerId: any) {
    try {
      const query = `
      INSERT INTO bettings (
        user_id,
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
        payment_status
    ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 )
    RETURNING id
    `;

      const values = [
        data.userId,
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
      ];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },
  all(punterId: any) {
    return db.query(`
    SELECT * FROM bettings
    WHERE user_id = ${punterId}
    ORDER BY updated_at DESC
    `);
  },
};

export default BetsModel;
