import mongoose from "mongoose";

const Connection = async () => {
  const URL = `mongodb+srv://Pradeep:root1234@blog-app.40zdgfr.mongodb.net/Blog`;
  try {
    await mongoose.connect(URL, { useNewUrlParser: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting to the database ", error);
  }
};

export default Connection;
