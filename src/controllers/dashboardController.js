import pool from "../db/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total Flats
    const totalFlats = await pool.query("SELECT COUNT(*) FROM flats_uat");

    // Total Residents
    const totalResidents = await pool.query(
      "SELECT COUNT(*) FROM residents_uat",
    );

    // Total Bills
    const totalBills = await pool.query(
      "SELECT COUNT(*) FROM maintenance_bills_uat",
    );

    // Total Collections
    const totalPayments = await pool.query(
      `
          SELECT
            COALESCE(
              SUM(amount_paid),
              0
            )
          FROM payments_uat
          `,
    );

    // Pending Bills
    const pendingBills = await pool.query(
      `
          SELECT
            COUNT(*) AS pending
          FROM maintenance_bills_uat
          WHERE payment_status =
            'pending'
          `,
    );

    // Paid Bills
    const paidBills = await pool.query(
      `
          SELECT
            COUNT(*) AS paid
          FROM maintenance_bills_uat
          WHERE payment_status =
            'paid'
          `,
    );

    // Monthly Collections
    const monthlyCollections = await pool.query(
      `
          SELECT
            TO_CHAR(
              payment_date,
              'Mon'
            ) AS month,

            SUM(amount_paid) AS total

          FROM payments_uat

          GROUP BY month

          ORDER BY
            MIN(payment_date)
          `,
    );

    // Occupied Flats
    const occupiedFlats = await pool.query(
      `
          SELECT
            COUNT(*) AS occupied
          FROM flats_uat
          WHERE occupancy_status =
            'occupied'
          `,
    );

    // Vacant Flats
    const vacantFlats = await pool.query(
      `
          SELECT
            COUNT(*) AS vacant
          FROM flats_uat
          WHERE occupancy_status =
            'vacant'
          `,
    );

    res.json({
      total_flats: totalFlats.rows[0].count,

      total_residents: totalResidents.rows[0].count,

      total_bills: totalBills.rows[0].count,

      total_payments: totalPayments.rows[0].coalesce,

      pending_bills: pendingBills.rows[0].pending,

      paid_bills: paidBills.rows[0].paid,

      occupied_flats: occupiedFlats.rows[0].occupied,

      vacant_flats: vacantFlats.rows[0].vacant,

      monthly_collections: monthlyCollections.rows,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
