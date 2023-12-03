import env from "dotenv";
env.config();

export const PORT = 5555;

export const mongoDBURL = process.env.MONGO_URL;
