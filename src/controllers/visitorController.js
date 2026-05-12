import pool from "../db/db.js";

export const createVisitor = async (req, res) => {
  try {
    const {
      flat_number,
      visitor_name,
      mobile_number,
      visitor_type,
      purpose,
      vehicle_number,
      approved_by,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO visitors_uat
      (
        flat_number,
        visitor_name,
        mobile_number,
        visitor_type,
        purpose,
        vehicle_number,
        approved_by,
        remarks
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        flat_number,
        visitor_name,
        mobile_number,
        visitor_type,
        purpose,
        vehicle_number,
        approved_by,
        remarks,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Visitor added successfully",
      visitor: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getVisitors = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM visitors_uat
      ORDER BY created_at DESC
      `,
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const checkoutVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      UPDATE visitors_uat
      SET
        status='checked_out',
        out_time=CURRENT_TIMESTAMP
      WHERE id=$1
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Visitor checked out",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
