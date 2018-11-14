const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Username: { type: String,required: true,unique: true},
    Contraseña: { type: String, required: true },
    Nombre: { type: String, required: true },
    Correo: { type: String,required: true ,unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
});

module.exports = mongoose.model('Users', usersSchema);