import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "Default",
        product:{
            name: "Task Manager",
            link: "https://taskmanagerlink.com", 
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent) ;
    const emailHTML = mailGenerator.generate(options.mailgenContent) ;
    
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST, 
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
        
    })

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transporter.sendMail(mail) ;
    } catch (error) {
        console.error("Error sending email. Make sure you have filled correct credentials of MAILTRAP in env file") ;
        console.error("Error:", error) ;
    }
}
const emailVerificationMailgenContent = (username, verificationLink) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Project Manager! We're very excited to have you on board.",
      action: {
        instructions: "To verify with your account, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify Your Account",
          link: verificationLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, resetLink) => {
  return {
    body: {
      name: username,
      intro: "You have requested to reset your password for Project Manager.",
      action: {
        instructions: "Please click the button below to reset your password:",
        button: {
          color: "#FF6F6F", // Optional action button color
          text: "Reset Password",
          link: resetLink,
        },
      },
      outro:
        "If you did not request this, please ignore this email.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } ;