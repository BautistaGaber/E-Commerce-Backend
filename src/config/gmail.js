import nodemailer from "nodemailer";
import { options } from "./config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: options.gmail.emailAdmin,
    pass: options.gmail.emailToken,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

//funcion envio de recuperacion de contraseña

export const sendRecoveryPass = async (userEmail, token)=>{
  const link = `http://localhost:8080/views/reset-password?token=${token}`;
  await transporter.sendMail({
      from:options.gmail.emailAdmin,
      to:userEmail,
      subject:"Reestablecer contraseña",
      html:`
      <div>
          <h2>Has solicitado un cambio de contraseña</h2>
          <p>Da click en el siguiente enlace para restablecer la contraseña</p>
          </br>
          <a href="${link}">
              <button> Restablecer contraseña </button>
          </a>
      </div>
      `
  })
};

export { transporter };
