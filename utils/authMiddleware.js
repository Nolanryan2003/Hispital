import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/authModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json("no token");
  }
});
