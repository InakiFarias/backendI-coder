import mongoose from "mongoose";

export const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("DB connected");
  } catch (e) {
    console.log(e);
  }
};
