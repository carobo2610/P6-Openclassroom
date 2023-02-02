//import de Mongoose qui fait le lien entre MongoDb et NodeJs
const mongoose = require('mongoose');

//créer schéma pour le model des utilisateurs 
const userSchema = mongoose.Schema({
    name: {type: String, required : true},
    date: {type: Date, default: Date.now},
    email:{ type: String, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, required : true }, 
    password: {type: String, match: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, required: true} //attend un mot de passe haché
})

//Exporter le schema des users
module.exports = mongoose.model('User', userSchema) 