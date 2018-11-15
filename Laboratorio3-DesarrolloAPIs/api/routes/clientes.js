const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Cliente = require('../models/cliente');


//metodo GET que obtiene todos los clientes de la pizzeria
router.get("/",(req, res, next) => {
    Cliente.find()
      .select("_id Nombre Correo Residencia ClienteFrecuente")
      .exec()
      .then(docs => {
        const response = {
          clientes: docs.map(doc => {
            return {
              _id: doc._id,
              Nombre: doc.Nombre,
              Correo: doc.Correo,
              Residencia: doc.Residencia,
              ClienteFrecuente: doc.ClienteFrecuente
            };
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(docs);
        //   } else {
        //       res.status(404).json({
        //           mensaje: 'Sin clientes en el servidor'
        //       });
        //   }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//metodo POST que registra los clientes para la pizzeria
router.post('/registrarse', (req,res,next)=> {
    Cliente.find({Correo: req.body.Correo})
    .exec()
    .then(cliente => {
            bcrypt.hash(req.body.Contraseña,10,(err, hash)=> {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const cliente = new Cliente({
                        _id: new mongoose.Types.ObjectId(),
                        Nombre: req.body.Nombre,
                        Correo: req.body.Correo,
                        //Contraseña: req.body.Contraseña
                        Contraseña: hash,
                        Residencia: req.body.Residencia,
                        ClienteFrecuente: req.body.ClienteFrecuente
                    });
                    cliente.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "¡Cliente creado con exito!"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        })
    });

//metodo POST que inicia sesion 
router.post('/login', (req , res, next) => {
    Cliente.find({Correo: req.body.Correo})
    .exec()
    .then(cliente => {
        if(cliente.length < 1) {
            return res.status(401).json({
                message: '¡No Autorizado!'
            });
        } 
        bcrypt.compare(req.body.Contraseña, user[0].Contraseña, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: '¡No Autorizado!'
                });     
            } 
            if (result) {
                const token = jwt.sign({
                    Correo: user[0].Correo,
                    _id: user[0]._id
                },
                 process.env.JWT_KEY,
                  {
                      //tiempo de expiración
                      //1 hora (se puede cambiar)
                      expiresIn: '1h'
                 }
                 );
                return res.status(200).json({
                    message: '¡Autorizado!',
                    token: token     
                });
            }
            return res.status(401).json({
                message: 'Correo/Contraseña incorrecto'
            }); 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


//metodo DELETE que elimina un usuario de la pizzeria
router.delete('/:userId', (req,res,next) => {
    const id = req.params.clienteId;
    Cliente.remove({ _id: req.param.clienteId})
    .exec()                                                                                                    
    .then(result => {
        res.status(200).json({
            message: "El cliente con id "+id +" ha sido eliminado"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;