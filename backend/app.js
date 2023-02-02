//importer Express
const express = require('express');
//Appel de la méthode express dans notre application 
const app = express();
//pour avoir acces au corps de notre requete POST , utilisé car version 4.18 d'Express
app.use(express.json()); 

//Importer les routes pour les users et pour les sauces 
const userRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');

//connexion à la base de données MongoDB, Cluster1, base données: P6_API
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://userP6:userp6@cluster1.osnmkkm.mongodb.net/?retryWrites=true&w=majority',
{ 
 })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

//fonction middleware générale à appliquer à toutes requètes entrantes. Pas d'adresse en 1er parametre
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  //Enregistrer la route de users depuis le dossier routes
  app.use('/api/auth', userRoutes);
  //Enrgeistrer la route des sauces depuis le dossier routes
  app.use('/api/sauces', saucesRoutes);


module.exports = app;