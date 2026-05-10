import pool from "../db/db.js";

export const createBill = async (req, res) => {
  try {
    const {
      flat_id,
      bill_month,
      bill_year,
      maintenance_amount,
      water_charges,
      parking_charges,
      penalty_amount,
      due_date,
    } = req.body;

    const total_amount =
      Number(maintenance_amount) +
      Number(water_charges) +
      Number(parking_charges) +
      Number(penalty_amount);

    const newBill = await pool.query(
      `INSERT INTO maintenance_bills
      (
        flat_id,
        bill_month,
        bill_year,
        maintenance_amount,
        water_charges,
        parking_charges,
        penalty_amount,
        total_amount,
        due_date
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        flat_id,
        bill_month,
        bill_year,
        maintenance_amount,
        water_charges,
        parking_charges,
        penalty_amount,
        total_amount,
        due_date,
      ],
    );

    res.status(201).json({
      message: "Maintenance bill created successfully",
      bill: newBill.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await pool.query(
      `SELECT
        maintenance_bills.*,
        flats.flat_number,
        flats.owner_name
      FROM maintenance_bills
      INNER JOIN flats
      ON maintenance_bills.flat_id = flats.id
      ORDER BY maintenance_bills.id DESC`,
    );

    res.json(bills.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      flat_id,
      bill_month,
      bill_year,
      maintenance_amount,
      water_charges,
      parking_charges,
      penalty_amount,
      total_amount,
      due_date,
      payment_status,
    } = req.body;

    const updatedBill = await pool.query(
      `
        UPDATE maintenance_bills
        SET
          flat_id = $1,
          bill_month = $2,
          bill_year = $3,
          maintenance_amount = $4,
          water_charges = $5,
          parking_charges = $6,
          penalty_amount = $7,
          total_amount = $8,
          due_date = $9,
          payment_status = $10
        WHERE id = $11
        RETURNING *
        `,
      [
        flat_id,
        bill_month,
        bill_year,
        maintenance_amount,
        water_charges,
        parking_charges,
        penalty_amount,
        total_amount,
        due_date,
        payment_status,
        id,
      ],
    );

    res.json({
      message: "Bill updated successfully",
      bill: updatedBill.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM maintenance_bills WHERE id = $1", [id]);

    res.json({
      message: "Bill deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
