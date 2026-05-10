import express from "express";

import {
  createFlat,
  getFlats,
  updateFlat,
  deleteFlat,
} from "../controllers/flatController.js";

const router = express.Router();

router.post("/", createFlat);
router.get("/", getFlats);
router.put("/:id", updateFlat);
router.delete("/:id", deleteFlat);

export default router;
