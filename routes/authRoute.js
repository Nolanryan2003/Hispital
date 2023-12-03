import express from "express";
import {
  login,
  register,
  update,
  logout,
  getUserProfile,
} from "../controllers/authController.js";
import {
  hospitalRegister,
  hosiptalLogin,
} from "../controllers/hospitalAuthController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/update", update);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/userprofile", protect, getUserProfile);

router.post("/hospitallogin", hosiptalLogin);
router.post("/hospitalregister", hospitalRegister);
export default router;
