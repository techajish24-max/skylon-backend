import pool from "../db/db.js";

export const createResident = async (req, res) => {
  try {
    const {
      flat_id,
      resident_name,
      mobile_number,
      email,
      relation,
      resident_type,
    } = req.body;

    const newResident = await pool.query(
      `INSERT INTO residents_uat
      (
        flat_id,
        resident_name,
        mobile_number,
        email,
        relation,
        resident_type
      )
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [flat_id, resident_name, mobile_number, email, relation, resident_type],
    );

    res.status(201).json({
      message: "Resident added successfully",
      resident: newResident.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getResidents = async (req, res) => {
  try {
    const residents = await pool.query(
      `
        SELECT
          residents.*,

          flats.flat_number

        FROM residents_uat

        INNER JOIN flats
        ON residents.flat_id = flats.id

        ORDER BY residents.id DESC
        `,
    );

    res.json(residents.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateResident = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      flat_id,
      resident_name,
      mobile_number,
      email,
      relation,
      resident_type,
    } = req.body;

    const updatedResident = await pool.query(
      `
        UPDATE residents_uat
        SET
          flat_id = $1,
          resident_name = $2,
          mobile_number = $3,
          email = $4,
          relation = $5,
          resident_type = $6
        WHERE id = $7
        RETURNING *
        `,
      [
        flat_id,
        resident_name,
        mobile_number,
        email,
        relation,
        resident_type,
        id,
      ],
    );

    res.json({
      message: "Resident updated successfully",
      resident: updatedResident.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM residents_uat WHERE id = $1", [id]);

    res.json({
      message: "Resident deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
