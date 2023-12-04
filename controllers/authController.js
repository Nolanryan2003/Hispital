import asyncHandler from "express-async-handler";
import { User } from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.json({ error: "username is required" });
  }

  if (!password || password.length < 8) {
    return res.json({
      error: "Password is required and should be atleast 8 character long",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const exist = await User.findOne({ username });

  if (exist) {
    res.json({ error: "UserName already taken" });
  }

  const user = await User.create({ username, password: hash });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      message: "User successfully created",
      user,
    });
  } else {
    res.status(400).json({
      message: "User not successful created",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.json({ error: "please enter username" });
    }

    if (!password) {
      return res.json({ error: "please enter password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ error: "user not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;

          res
            .cookie("jwt", token, {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
              maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json(user);
        }
      );
    }
    if (!match) {
      return res.json({ error: "password does not match" });
    }
  } catch (error) {
    return res.json({ error: "login unsuccessful" });
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expiresIn: new Date(0) });

  res.status(200).json("logged out");
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
  };

  res.json(user);
});

const update = asyncHandler(async (req, res) => {
  const { role, id } = req.body;

  try {
    if (!role || !id) {
      return res.status(400).json({ message: "Role and ID are required." });
    }

    if (role === "admin") {
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }

      if (user.role !== "admin") {
        user.role = role;

        await user.save();

        res.status(201).json({ message: "Update successful", user });
      } else {
        res.status(400).json({ message: "User is already an Admin" });
      }
    } else {
      res.status(400).json({ message: "Role must be 'admin'." });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "An error occurred", error: error.message });
  }
});
export { register, login, update, logout, getUserProfile };
