const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tu-correo@gmail.com",
    pass: "tu-contraseña",
  },
});

exports.sendEmailAndInvite = functions.firestore
  .document("usuarios/{usuarioId}")
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    const {email, type, rol} = newUser;
    const usuarioId = context.params.usuarioId; // Obtener usuarioId de context.params

    let mailOptions;

    if (type === "registro") {
      mailOptions = {
        from: "tu-correo@gmail.com",
        to: email,
        subject: "Bienvenido a nuestra plataforma",
        text: `¡Hola ${newUser.nombre}! Gracias por registrarte en nuestra app, navega en ella para que veas las funciones que tenemos para ti.`,
      };
    } else if (type === "invite") {
      mailOptions = {
        from: "tu-correo@gmail.com",
        to: email,
        subject: "Has sido invitado a nuestra plataforma",
        text: `¡Hola ${newUser.nombre}! Has sido invitado a unirte a un equipo con el rol de ${rol}. Haz clic en el siguiente enlace para registrarte y acceder a la aplicación: https://tudominio.com/register/${usuarioId}`,
      };
    } else {
      console.error("Tipo de correo no válido");
      return;
    }

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo electrónico enviado a ${email}`);

      if (type === "invite") {
        // Aquí podrías registrar al usuario como invitado en Firestore
        // Ejemplo de cómo almacenar datos en Firestore
        // admin.firestore().collection('usuarios').doc(usuarioId).set({
        //   email: email,
        //   rol: rol,
        //   invitado: true
        // });
      }
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  });
