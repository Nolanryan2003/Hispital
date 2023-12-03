import express from "express";
import {
  getOnePatient,
  createOnePatient,
  getAllPatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/:id", getOnePatient);

router.post("/", createOnePatient);
router.get("/", getAllPatient);

export default router;
