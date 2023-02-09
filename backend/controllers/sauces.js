//fichier controllers pour gérer les routes qui modifies les sauces
const Sauces = require('../models/Sauces');
//Import du package "fs" de Node pour avoir accès au File System
const fs = require('fs').promises;

exports.getAllSauces = async (req, res, next) => {
  try {
    let sauces = await Sauces.find()
    return res.status(200).json(sauces);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
};

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
    //vérif si c'est bien le créateur de la sauce qui veut la modifier
    let sauce = await Sauces.findOne({ _id: req.params.id });
    if (!sauce) { //vérifier si la sauce à modifier existe
      return res.status(404).json({ message: "Sauce introuvable" })
    }
    //si sauce existe, vérif si c'est le créateur de la sauce qui veut modifier
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

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      //vérifier que le sauce existe
      if (!sauce) {
        return res.status(404).json({ message: 'Sauce non trouvée' });
        //vérifier que c'est bien le créateur de la sauce qui veit la supprimer
      } else if (sauce.userId != req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request" });
      } else {
        //supprimer l'image 
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink("images/" + filename, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch((error) => res.status(404).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};



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
        //   Retrait du like
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
        //   Retrait du dislike
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

      //   Retrait d'un like ou d'un dislike

      case -1:
        console.log("toto")
        //   Ajout d'un dislike
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

// exports.likeDislikeSauce = (req, res, next) => {
//   Sauces.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       switch (req.body.like) {
//         case 1:
//           // Ajout d'un like
//           if (!sauce.usersLiked.includes(req.body.userId)) {
//             Sauces.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { likes: 1 },
//                 $push: { usersLiked: req.body.userId },
//               }
//             )
//               .then(() =>
//                 res.status(201).json({ message: "Like enregistré" })
//               )
//               .catch((error) => res.status(400).json({ error }));
//           }
//           break;
//         //   Retrait d'un like ou d'un dislike
//         case 0:
//           //   Retrait du like
//           if (sauce.usersLiked.includes(req.body.userId)) {
//             Sauces.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { likes: -1 },
//                 $pull: { usersLiked: req.body.userId },
//               }
//             )
//               .then(() => res.status(201).json({ message: "Like retiré" }))
//               .catch((error) => res.status(400).json({ error }));
//           }
//           //   Retrait du dislike
//           if (sauce.usersDisliked.includes(req.body.userId)) {
//             Sauces.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { dislikes: -1 },
//                 $pull: { usersDisliked: req.body.userId },
//               }
//             )
//               .then(() => res.status(201).json({ message: "Dislike retiré" }))
//               .catch((error) => res.status(400).json({ error }));
//           }
//           break;
//         case -1:
//           //   Ajout d'un dislike
//           if (!sauce.usersDisliked.includes(req.body.userId)) {
//             Sauces.updateOne(
//               { _id: req.params.id },
//               {
//                 $inc: { dislikes: 1 },
//                 $push: { usersDisliked: req.body.userId },
//               }
//             )
//               .then(() =>
//                 res.status(201).json({ message: "Dislike enregistré" })
//               )
//               .catch((error) => res.status(400).json({ error }));
//           }
//           break;
//       }
//     })
//     .catch((error) => res.status(404).json({ error }));
// };