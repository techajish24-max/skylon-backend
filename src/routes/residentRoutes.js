import express from "express";

import {
  createResident,
  getResidents,
  updateResident,
  deleteResident,
} from "../controllers/residentController.js";

const router = express.Router();

router.post("/", createResident);
router.get("/", getResidents);
router.put("/:id", updateResident);
router.delete("/:id", deleteResident);

export default router;
