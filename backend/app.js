//Importer Express
const express = require('express');
//démarrage de Express 
const app = express();
//Importer module CORS de Node.js
const cors = require('cors');
//Appel et configuration du package Dotenv de Node.js
const dotenv = require('dotenv');
dotenv.config();
//Importer Helmet de Node.js
//const helmet = require("helmet");
//Acceder au module "path" de Node.js pour travailler avec le dossier "images" 
const path = require('path');
// Importe Mongo sanitizer
const mongoSanitize = require('express-mongo-sanitize');
//rate limiter
const rateLimit = require('express-rate-limit');

//Importer les routes  
const userRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');

//Connexion à la base de données MongoDB
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,
  {
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//Pour avoir acces au corps de notre requete POST , utilisé car version 4.18 d'Express
app.use(express.json());
//Activation du module Cors
app.use(cors());
//Sanitizer les données contre attaques NoSQL
app.use(mongoSanitize());
//Rate limiter d'Express: limite le nombre de requètes retourne erreur 429
const limiter = rateLimit({
 windowMs: 60 * 60 * 1000, // 1 heure
 max: 100,   //100 requètes
});
app.use(limiter);
//Indique à Express de gérer la ressource images de manière statique à chaque requète avec /images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Enregistrer la route de users depuis le dossier routes
app.use('/api/auth', userRoutes);
//Enregistrer la route des sauces depuis le dossier routes
app.use('/api/sauces', saucesRoutes);

module.exports = app;