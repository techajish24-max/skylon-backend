import pool from "../db/db.js";

export const createPayment = async (req, res) => {
  try {
    const {
      bill_id,
      amount_paid,
      payment_mode,
      transaction_reference,
      payment_date,
      notes,
    } = req.body;

    // Insert payment
    const newPayment = await pool.query(
      `INSERT INTO payments_uat
      (
        bill_id,
        amount_paid,
        payment_mode,
        transaction_reference,
        payment_date,
        notes
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        bill_id,
        amount_paid,
        payment_mode,
        transaction_reference,
        payment_date,
        notes,
      ],
    );

    const paymentId = newPayment.rows[0].id;

    // Generate receipt number
    const receiptNumber = `RCPT-${Date.now()}`;

    // Create receipt
    await pool.query(
      `
  INSERT INTO receipts
  (
    payment_id,
    receipt_number
  )
  VALUES ($1, $2)
  `,
      [paymentId, receiptNumber],
    );

    // Update bill status
    await pool.query(
      `UPDATE maintenance_bills
       SET payment_status = 'paid'
       WHERE id = $1`,
      [bill_id],
    );

    res.status(201).json({
      message: "Payment added successfully",
      payment: newPayment.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await pool.query(
      `SELECT
        payments.*,
        maintenance_bills.bill_month,
        maintenance_bills.bill_year,
        flats.flat_number,
        flats.owner_name
      FROM payments_uat

      INNER JOIN maintenance_bills
      ON payments.bill_id = maintenance_bills.id

      INNER JOIN flats
      ON maintenance_bills.flat_id = flats.id

      ORDER BY payments.id DESC`,
    );

    res.json(payments.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      bill_id,
      amount_paid,
      payment_date,
      payment_mode,
      transaction_reference,
      notes,
    } = req.body;

    const updatedPayment = await pool.query(
      `
        UPDATE payments_uat
        SET
          bill_id = $1,
          amount_paid = $2,
          payment_date = $3,
          payment_mode = $4,
          transaction_reference = $5,
          notes = $6
        WHERE id = $7
        RETURNING *
        `,
      [
        bill_id,
        amount_paid,
        payment_date,
        payment_mode,
        transaction_reference,
        notes,
        id,
      ],
    );

    res.json({
      message: "Payment updated successfully",
      payment: updatedPayment.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM payments_uat WHERE id = $1", [id]);

    res.json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
