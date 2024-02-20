import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO =
      "mongodb+srv://bautistagaber:UZ7N4k7m88BIAs2L@cluster0.hdnj5k1.mongodb.net/segunda-preentrega";
    await mongoose.connect(MONGO);
  } catch (err) {
    console.error("Error: ", err);
  }
};
