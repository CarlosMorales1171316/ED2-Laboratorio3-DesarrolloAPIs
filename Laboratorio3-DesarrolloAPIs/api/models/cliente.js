const mongoose = require('mongoose');

const clientesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Nombre: { type: String,required: true},
    Correo: { type: String,required: true ,unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    Contraseña: { type: String, required: true },
    Residencia: { type: String, required: true },
    ClienteFrecuente: { type: Boolean, required: true}
    
});

module.exports = mongoose.model('Clientes', clientesSchema);
