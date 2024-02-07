import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

export const options = {
  server: {
    port: PORT,
  },

  mongo: {
    url: MONGO_URL,
  },
};
