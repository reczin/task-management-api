import mongoose from "mongoose";

export const connectDB = async (
  uri: string,
  options?: mongoose.ConnectOptions
) => {
  await mongoose.connect(uri, options);
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
