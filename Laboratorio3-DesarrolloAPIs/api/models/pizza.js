const mongoose = require('mongoose');

const pizzasSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Nombre: { type: String, required: true },
    Descripción: { type: String, required: true },
    Ingredientes: { type: Array, required: true },
    TipoDeMasa: { type: String, required: true },
    Tamaño: { type: String, required: true },
    NumeroDePorciones: { type: String, required: true },
    ExtraQueso: { type: Boolean, required: true }
    
});

module.exports = mongoose.model('Pizzas', pizzasSchema);