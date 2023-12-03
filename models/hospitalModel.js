import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

export const HospitalUser = mongoose.model("HospitalUsers", userSchema);
