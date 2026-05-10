import pool from "../db/db.js";

export const createReceipt = async (req, res) => {
  try {
    const { payment_id, receipt_date } = req.body;

    // Generate receipt number
    const receipt_number = `RCT-${Date.now()}`;

    const newReceipt = await pool.query(
      `INSERT INTO receipts
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

          receipts.id,

          receipts.receipt_number,

          receipts.receipt_date,

          payments.amount_paid,

          payments.payment_mode,

          payments.payment_date,

          flats.flat_number,

          flats.owner_name,

          maintenance_bills.maintenance_amount,

          maintenance_bills.water_charges,

          maintenance_bills.parking_charges,

          maintenance_bills.penalty_amount,

          maintenance_bills.total_amount

        FROM receipts

        INNER JOIN payments
        ON receipts.payment_id = payments.id

        INNER JOIN maintenance_bills
        ON payments.bill_id = maintenance_bills.id

        INNER JOIN flats
        ON maintenance_bills.flat_id = flats.id

        ORDER BY receipts.id DESC
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

    await pool.query("DELETE FROM receipts WHERE id = $1", [id]);

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
