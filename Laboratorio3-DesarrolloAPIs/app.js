const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const pizzaRoutes = require("./api/routes/pizzas");
const clienteRoutes = require("./api/routes/clientes");

mongoose.connect(
  //aqui se conecta a nuestro servior y la variable process.env.MONGO_ATLAS_PW es donde esta nuestra 
  //contraseña del servidor situado en el json de "nodemon.json"
  "mongodb://ED2_Laboratorio3:" +
  process.env.MONGO_ATLAS_PW + 
    "@laboratorio3-shard-00-00-hsqcz.mongodb.net:27017,laboratorio3-shard-00-01-hsqcz.mongodb.net:27017,laboratorio3-shard-00-02-hsqcz.mongodb.net:27017/test?ssl=true&replicaSet=Laboratorio3-shard-0&authSource=admin&retryWrites=true",
  {
    useMongoClient: true
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // (*) = cualquier origen
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    //verbos permitidos
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// Rutas-Manejador de Request
app.use("/pizzas", pizzaRoutes);
app.use("/clientes", clienteRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
