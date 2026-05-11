import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // MOBILE VALIDATION

    if (!/^\d{10}$/.test(String(mobile).trim())) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits",
      });
    }

    // CHECK EXISTING USER

    const existingUser = await pool.query(
      "SELECT * FROM users_uat WHERE email = $1 OR mobile = $2",
      [email, mobile],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 6);

    // INSERT USER

    const newUser = await pool.query(
      `
        INSERT INTO users_uat
        (
          name,
          email,
          mobile,
          password,
          role
        )
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
        `,
      [name, email, mobile, hashedPassword, "admin"],
    );

    res.status(201).json({
      message: "Account registered successfully",

      user: newUser.rows[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await pool.query("SELECT * FROM users_uat WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        mobile: user.rows[0].mobile,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
