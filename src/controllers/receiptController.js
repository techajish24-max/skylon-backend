import pool from "../db/db.js";

export const createReceipt = async (req, res) => {
  try {
    const { payment_id, receipt_date } = req.body;

    // Generate receipt number
    const receipt_number = `RCT-${Date.now()}`;

    const newReceipt = await pool.query(
      `INSERT INTO receipts_uat
      (
        payment_id,
        receipt_number,
        receipt_date
      )
      VALUES
      ($1, $2, $3)
      RETURNING *`,
      [payment_id, receipt_number, receipt_date],
    );

    res.status(201).json({
      message: "Receipt generated successfully",
      receipt: newReceipt.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getReceipts = async (req, res) => {
  try {
    const receipts = await pool.query(
      `
        SELECT

          receipts_uat.id,

          receipts_uat.receipt_number,

          receipts_uat.receipt_date,

          payments_uat.amount_paid,

          payments_uat.payment_mode,

          payments_uat.payment_date,

          flats_uat.flat_number,

          flats_uat.owner_name,

          maintenance_bills_uat.maintenance_amount,

          maintenance_bills_uat.water_charges,

          maintenance_bills_uat.parking_charges,

          maintenance_bills_uat.penalty_amount,

          maintenance_bills_uat.total_amount

        FROM receipts_uat

        INNER JOIN payments_uat
        ON receipts_uat.payment_id = payments_uat.id

        INNER JOIN maintenance_bills_uat
        ON payments_uat.bill_id = maintenance_bills_uat.id

        INNER JOIN flats_uat
        ON maintenance_bills_uat.flat_id = flats_uat.id

        ORDER BY receipts_uat.id DESC
        `,
    );

    res.json(receipts.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM receipts_uat WHERE id = $1", [id]);

    res.json({
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
