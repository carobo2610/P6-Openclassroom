//import de Mongoose qui fait le lien entre MongoDb et NodeJs
const mongoose = require('mongoose');

//ajout de mongoose-unique-validator comme pluggin à notre schema 
const uniqueValidator = require('mongoose-unique-validator');

//créer schéma pour le model des utilisateurs 
const userSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    email:{ type: String, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, required : true }, 
    password: {type: String, match: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, required: true} 
})

//appliquer ce validator au schema avant d'en faire un modele
userSchema.plugin(uniqueValidator);

//Exporter le schema des users
module.exports = mongoose.model('User', userSchema) 