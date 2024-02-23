const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const { db } = require("./firebase");
const cookieParser = require("cookie-parser");
const app = express();
const { isLogged, auth } = require("./auth/session_auth");
const {
  leerDeFirestore,
  escribirEnFirestore,
  leerConFiltroFirestore,
} = require("./utils/firestore_utils");

// Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.create({
    defaultLayout: "main",
    extname: ".hbs",
  }).engine
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

app.use(require("./routers/index"));
app.use(require("./routers/añadir"));
app.use(require("./routers/home"));
app.use(require("./routers/archivos"));
app.use(require("./routers/usuarios"));
app.use(require("./routers/new_mascota"));
app.use(require("./routers/email/crear_usuario"));
app.use(require("./routers/email/iniciar_sesion"));
app.use(require("./routers/email/cerrar_sesion"));
app.use(require("./routers/citas"));
app.use(require("./routers/registros_medicos"));
app.use(require("./routers/presentar_mascota"));
app.use(require("./routers/mensajes"));

app.get("/index", (req, res) => {
  res.render("layouts/main"); // Renderiza el archivo signup.hbs
});
app.get("/perfil", async (req, res) => {
  try {
    const firestoreResponse = await leerDeFirestore("admin_user", "admin_user");
    res.render("perfil", {
      perfil: firestoreResponse,
      scripts: '<script src="/js/perfil_script.js"></script>',
    });
  } catch (error) {
    console.error("Error al cargar el documento:", error);
    res.render("error", {
      errorMessage: "Error al cargar el perfil" + error,
      errorCode: "500",
    });
  }
});

app.post("/perfil/editar", async (req, res) => {
  try {
    await escribirEnFirestore("admin_user", req.body.data, "admin_user");
    res.send("Perfil editado exitosamente");
  } catch (error) {
    console.error("Error al editar el documento:", error);
    res.render("error", {
      errorMessage: "Error al editar el perfil" + error,
      errorCode: "500",
    });
  }
});

app.use(express.static('src/public'));

app.get("/home", (req, res) => {
  res.render("home"); // Renderiza el archivo signup.hbs
});

app.get("/registrarse", isLogged, (req, res) => {
  res.render("partials/registarse"); // Renderiza el archivo signup.hbs
});

app.get("/anadir", (req, res) => {
  res.render("anadir");
});

app.get("/usuarios", (req, res) => {
  res.render("usuarios");
});

app.get("/new_mascota/:cedula/:userId", (req, res) => {
  res.render("new_mascota", { cedula: req.params.cedula, userId: req.params.userId });
});

app.get("/crear_usuario", function (req, res) {
  res.render("partials/crear_usuario"); // Esta línea renderiza la vista "crear_usuario.hbs"
});

app.get("/datos_usuario", function (req, res) {
  res.render("partials/datos_usuario"); // Esta línea renderiza la vista "crear_usuario.hbs"
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
