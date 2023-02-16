//fichier controllers pour gérer la logique de "sauces" avec les conditions
//Importer le modèle "Sauces"
const Sauces = require('../models/Sauces');
//Import du package "fs" de Node pour avoir accès au File System
const fs = require('fs').promises;

//Middleware pour récupérer toutes les sauces
exports.getAllSauces = async (req, res, next) => {
  try {
    let sauces = await Sauces.find()
    return res.status(200).json(sauces);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
};

//Middleware pour récupérer une seule sauce avec son id
exports.getOneSauce = async (req, res, next) => {
  try {
    let sauce = await Sauces.findOne({ _id: req.params.id });
    if (!sauce) {
      return res.status(404).json({ message: 'Sauce non trouvée' });
    }
    return res.status(200).json(sauce);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error });
  }
};

//Middleware pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete req.body._userId;
  const sauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

//Middleware pour modfier une sauce
exports.modifySauce = async (req, res, next) => {
  try {
    //si l'objet est modifié avec une image 
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body } //si pas d'image on récupère l'objet dans le corps de la requète
    delete sauceObject.userId;
    delete sauceObject._id;
    delete sauceObject.likes;
    delete sauceObject.dislikes;
    delete sauceObject.usersLiked;
    delete sauceObject.usersDisliked;
    
    let sauce = await Sauces.findOne({ _id: req.params.id });
    if (!sauce) { //vérifier si la sauce à modifier existe
      return res.status(404).json({ message: "Sauce introuvable" })
    } 
    //si la sauce existe, vérif si c'est le créateur de la sauce qui veut modifier
    if (sauce.userId != req.auth.userId) { //si NON
      return res.status(403).json({ message: "Unauthorized request" });
    }
    //si une nouvelle image est ajoutée, on supprime l'ancienne
    if (req.file) {
      const filename = sauce.imageUrl.split("/images/")[1];
      await fs.unlink(`images/${filename}`);
    }
    await Sauces.updateOne({ _id: req.params.id }, { ...sauceObject })
    return res.status(201).json({ message: 'Sauce modifiée' })
  }
  catch (error) {
    return res.status(500).json({ error })
  }
};

//Middleware pour supprimer une sauce
exports.deleteSauce = async (req, res) => {
  try { //vérifier que la sauce existe
    let sauce = await Sauces.findOne({ _id: req.params.id });
    if(!sauce){
      return res.status(404).json({ message : 'Sauce non trouvée'});
    } //Vérifier que c'est bien le créateur de la sauce qui veut supprimer
    if (sauce.userId != req.auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    } //supprimer l'image et supprimer l'id de la sauce
    const filename = sauce.imageUrl.split("/images/")[1];
      await fs.unlink(`images/${filename}`);
      await Sauces.deleteOne({ _id: req.params.id });
    return res.status(204).json({ message: "Sauce supprimée" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error });
  }
};

//Middleware pour Liker ou Disliker une sauce
exports.likeDislikeSauce = async (req, res, next) => {
  try {
  let sauce = await Sauces.findOne({ _id: req.params.id });
  switch (req.body.like) {
    case 1:
      // Ajout d'un like
      if (!sauce.usersLiked.includes(req.body.userId)) {
        await Sauces.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
        return res.status(201).json({ message: "Like enregistré" })
      }
      break;
      case 0:
        // Retrait du like
        if (sauce.usersLiked.includes(req.body.userId)) {
          await Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          ) 
          return res.status(201).json({ message: "Like retiré" })
        } 
        // Retrait du dislike
        if (sauce.usersDisliked.includes(req.body.userId)) {
          await Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
          return res.status(201).json({ message: "Dislike retiré" })
        }
        break;
      case -1:
        // Ajout d'un dislike
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          await Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: req.body.userId },
            }
          )
          return res.status(201).json({ message: "Dislike enregistré" })
        }
        break;
  }  
} catch (error) {
  console.log({ error })
}
};
