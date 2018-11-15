const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pizza = require("../models/pizza")

//metodo GET que obtiene todas las pizzas
router.get("/", (req, res, next) => {
  Pizza.find()
    .select("_id Nombre Descripción Ingredientes TipoDeMasa Tamaño NumeroDePorciones ExtraQueso")
    .exec()
    .then(docs => {
      const response = {
        pizzas: docs.map(doc => {
          return {
            _id: doc._id,
            Nombre: doc.Nombre,
            Descripción: doc.Descripción,
            Ingredientes: doc.Ingredientes,
            TipoDeMasa: doc.TipoDeMasa,
            Tamaño: doc.Tamaño,
            NumeroDePorciones: doc.NumeroDePorciones,
            ExtraQueso: doc.ExtraQueso
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(docs);
      /*   } else {
             res.status(404).json({
                 mensaje: 'Sin pizzas en el servidor'
             });
         }
      */
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//metodo POST que ingresa pizzas
router.post("/", (req, res, next) => {
  const pizza = new Pizza({
    _id: new mongoose.Types.ObjectId(),
    Nombre: req.body.Nombre,
    Descripción: req.body.Descripción,
    Ingredientes: req.body.Ingredientes,
    TipoDeMasa: req.body.TipoDeMasa,
    Tamaño: req.body.Tamaño,
    NumeroDePorciones: req.body.NumeroDePorciones,
    ExtraQueso: req.body.ExtraQueso
  });
  pizza
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
          _id: result._id,
          Nombre: req.body.Nombre,
          Descripción: req.body.Descripción,
          Ingredientes: req.body.Ingredientes,
          TipoDeMasa: req.body.TipoDeMasa,
          Tamaño: req.body.Tamaño,
          NumeroDePorciones: req.body.NumeroDePorciones,
          ExtraQueso: req.body.ExtraQueso
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//metodo GET que obtiene un mensaje especifico al ingresar un ID del mensaje a buscar
router.get("/:pizzaId", (req, res, next) => {
  const id = req.params.pizzaId;
  Pizza.findById(id)
    .select("_id Nombre Descripción Ingredientes TipoDeMasa Tamaño NumeroDePorciones ExtraQueso")
    .exec()
    .then(doc => {
      console.log("Información del Servidor:", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ mensaje: "ID de la pizza invalido" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//metodo DELETE que elimina una pizza al ingresar el ID de la pizza a eliminar
router.delete("/:pizzaId", (req, res, next) => {
  const id = req.params.pizzaId;
  Pizza.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          mensaje: 'Pizza con id '+ id +' ha sido eliminado',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//metodo PUT que actualiza una pizza al ingresar el ID de la pizza a actualizar/crear
router.put('/:pizzaId', function (req, res) {
  Pizza.findByIdAndUpdate(req.params.pizzaId,
     req.body,
      {
        new: true
      }, 
      function (err, pizza) {
      if (err) 
      return res.status(500)
      .send("Error al actualizar la pizza");
      res.status(200).send(pizza);
  });
});

module.exports = router;
