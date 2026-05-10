import pool from "../db/db.js";

export const createFlat = async (req, res) => {
  try {
    const {
      flat_number,
      owner_name,
      mobile_number,
      email,
      floor_number,
      flat_type,
      area_sqft,
      occupancy_status,
      parking_number,
    } = req.body;

    const newFlat = await pool.query(
      `INSERT INTO flats
      (
        flat_number,
        owner_name,
        mobile_number,
        email,
        floor_number,
        flat_type,
        area_sqft,
        occupancy_status,
        parking_number
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        flat_number,
        owner_name,
        mobile_number,
        email,
        floor_number,
        flat_type,
        area_sqft,
        occupancy_status,
        parking_number,
      ],
    );

    res.status(201).json({
      message: "Flat created successfully",
      flat: newFlat.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getFlats = async (req, res) => {
  try {
    const flats = await pool.query("SELECT * FROM flats ORDER BY id ASC");

    res.json(flats.rows);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateFlat = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      flat_number,
      owner_name,
      mobile_number,
      email,
      floor_number,
      flat_type,
      area_sqft,
      occupancy_status,
      parking_number,
    } = req.body;

    const updatedFlat = await pool.query(
      `UPDATE flats
       SET
         flat_number = $1,
         owner_name = $2,
         mobile_number = $3,
         email = $4,
         floor_number = $5,
         flat_type = $6,
         area_sqft = $7,
         occupancy_status = $8,
         parking_number = $9
       WHERE id = $10
       RETURNING *`,
      [
        flat_number,
        owner_name,
        mobile_number,
        email,
        floor_number,
        flat_type,
        area_sqft,
        occupancy_status,
        parking_number,
        id,
      ],
    );

    res.json({
      message: "Flat updated successfully",
      flat: updatedFlat.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteFlat = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM flats WHERE id = $1", [id]);

    res.json({
      message: "Flat deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
