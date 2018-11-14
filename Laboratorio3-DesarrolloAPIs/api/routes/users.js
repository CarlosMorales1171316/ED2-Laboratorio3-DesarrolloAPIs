const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const verificarAutenticacion = require('../middleware/verificar_autorizacion');

//metodo get que obtiene todos los usuarios
router.get("/", verificarAutenticacion, (req, res, next) => {
    User.find()
      .select("_id Username Nombre Correo")
      .exec()
      .then(docs => {
        const response = {
          users: docs.map(doc => {
            return {
              _id: doc._id,
              Username: doc.Username,
              Nombre: doc.Nombre,
              Correo: doc.Correo
            };
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(docs);
        //   } else {
        //       res.status(404).json({
        //           mensaje: 'Sin Usuarios en el servidor'
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

//crear usuarios
router.post('/registrarse', (req,res,next)=> {
    User.find({Username: req.body.Username})
    .exec()
    .then(user => {
        if(user.length >=1 ){
            return res.status(422).json({
                message: 'Username ya existente, intente con otro'
            });
        } else {
            bcrypt.hash(req.body.Contraseña,10,(err, hash)=> {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        Username: req.body.Username,
                        //Contraseña: req.body.Contraseña
                        Contraseña: hash,
                        Nombre: req.body.Nombre,
                        Correo: req.body.Correo
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "¡Usuario creado con exito!"
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
        }
    }) 
});


router.post('/login', (req , res, next) => {
    User.find({Username: req.body.Username})
    .exec()
    .then(user => {
        if(user.length < 1) {
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
                    Username: user[0].Username,
                    _id: user[0]._id
                },
                 process.env.JWT_KEY,
                  {
                      //tiempo de expiración
                      expiresIn: '1m'
                 }
                 );
                return res.status(200).json({
                    message: '¡Autorizado!',
                    token: token     
                });
            }
            return res.status(401).json({
                message: 'Username/Contraseña incorrecto'
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


//borrar usuarios
router.delete('/:userId', (req,res,next) => {
    const id = req.params.userId;
    User.remove({ _id: req.param.userId})
    .exec()                                                                                                    
    .then(result => {
        res.status(200).json({
            message: "El usuario con id "+id +" ha sido eliminado"
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