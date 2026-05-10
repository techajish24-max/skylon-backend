import express from "express";

import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// GET Payments
router.get("/", getPayments);

// CREATE Payment
router.post("/", createPayment);

// UPDATE Payment
router.put("/:id", updatePayment);

// DELETE Payment
router.delete("/:id", deletePayment);

export default router;
