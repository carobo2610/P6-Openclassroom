//importer de Mongoose 
const mongoose = require('mongoose');   

const saucesSchema = mongoose.Schema({               
    userId: {type: String, required: true},   
    name: {type: String, required: true},          
    manufacturer: {type: String, required: true},   
    description: { type: String, required: true },  
    mainPepper: {type: String, required: true},     
    imageUrl: { type: String, required: true},     
    heat: { type: Number, required: true},         
    likes: { type: Number, defaut: 0},             
    dislikes: { type: Number, defaut: 0 },          
    usersLiked: {type: Array, default: [], required: false},
    usersDisliked: {type: Array, default: [], required: false}
});
//exporter modele terminé (mongoose.model)  = 'Sauces': nom du modèle, schéma :'saucesSchema)
module.exports = mongoose.model('Sauces', saucesSchema);
