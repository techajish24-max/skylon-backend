import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK EXISTING USER

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER

    const newUser = await pool.query(
      `
        INSERT INTO users
        (
          name,
          email,
          password,
          role
        )
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
        `,
      [name, email, hashedPassword, "admin"],
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
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
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
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
