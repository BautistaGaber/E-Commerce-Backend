import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

export const options = {
  server: {
    port: PORT,
  },
  gmail:{
    emailToken:process.env.SECRET_TOKEN_EMAIL,
    emailAdmin:process.env.EMAIL_ADMIN,
    emailPass:process.env.EMAIL_PASSWORD
},
  mongo: {
    url: MONGO_URL,
  },
};
