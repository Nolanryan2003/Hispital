import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HospitalUser } from "../models/hospitalModel.js";

const hospitalRegister = asyncHandler(async (req, res) => {
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

  const exist = await HospitalUser.findOne({ username });

  if (exist) {
    res.json({ error: "UserName already taken" });
  }

  const user = await HospitalUser.create({ username, password: hash });

  if (user) {
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

// const login = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;
//   // Check if username and password is provided
//   if (!username || !password) {
//     return res.status(400).json({
//       message: "Username or Password not present",
//     });
//   }
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(400).json({
//         message: "Login not successful",
//         error: "User not found",
//       });
//     } else {
//       // comparing given password with hashed password
//       bcrypt.compare(password, user.password).then(function (result) {
//         result
//           ? res.status(200).json({
//               message: "Login successful",
//               user,
//             })
//           : res.status(400).json({ message: "Login not succesful" });
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// });

const hosiptalLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.json({ error: "please enter username" });
    }

    if (!password) {
      return res.json({ error: "please enter password" });
    }

    const user = await HospitalUser.findOne({ username });
    if (!user) {
      return res.json({ error: "user not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      jwt.sign(
        { username: user.username, id: user._id },
        "15tuegbh478",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token, { httpOnly: true }).json(user);
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

const update = asyncHandler(async (req, res) => {
  const { role, id } = req.body;

  try {
    if (!role || !id) {
      return res.status(400).json({ message: "Role and ID are required." });
    }

    if (role === "admin") {
      const user = await HospitalUser.findById(id);

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
export { hospitalRegister, hosiptalLogin, update };
