//importer de Mongoose 
const mongoose = require('mongoose');   

const saucesSchema = mongoose.Schema({               //fonction schema mis à dispo par package mongoose par objet dont le schema thing aura besoin
    userId: {type: String, required: false},         //identifiant MongoDb unqieu de l'utilisateur qui a créé la sauce
    name: {type: String, required: true},           //nom de la sauce
    manufacturer: {type: String, required: true},   //fabriquant de la sauce
    description: { type: String, required: true },  //description de la sauce
    mainPepper: {type: String, required: true},     //principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: false },     //Url de l'image de la sauce
    heat: { type: Number, required: true },         //Nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, required: false },        //NOmbre d'utilisateurs qui aiment 
    dislikes: { type: Number, required: false },     //Nombre d'utiisateurs qui n'aiment pas

});
//exporter modele terminé (mongoose.model)  = 'Sauces': nom du modèle, schéma :'saucesSchema)
module.exports = mongoose.model('Sauces', saucesSchema);
