import Express from "express";
import {
  createOneConsult,
  getAllConsults,
  deleteConsult,
  getOneConsults,
  getDeletedConsults,
} from "../controllers/consultsController.js";

const router = Express.Router();

router.get("/", getAllConsults);
router.post("/", createOneConsult);
router.post("/historyconsult", deleteConsult);
router.get("/consult", getOneConsults);
router.get("/deletedconsult", getDeletedConsults);

export default router;
