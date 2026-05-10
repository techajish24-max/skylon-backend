import express from "express";

import {
  createBill,
  getBills,
  updateBill,
  deleteBill,
} from "../controllers/billingController.js";

const router = express.Router();

// GET Bills
router.get("/", getBills);

// CREATE Bill
router.post("/", createBill);

// UPDATE Bill
router.put("/:id", updateBill);

// DELETE Bill
router.delete("/:id", deleteBill);

export default router;
