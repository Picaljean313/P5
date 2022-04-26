/* On définit la variable corrsepondant au panier dès la page d'accueil pour être sûr de pouvoir la manipuler quelque soit le chemin pris par l'utilisateur (l'utilisateur démarrant inévitablement son parcours par la page d'accueil) */

let cart;


/* On définit la fonction qui importe les données des produits depuis l'API pour les afficher dans la page d'accueil */

function productsImportation () {
  fetch("http://localhost:3000/api/products") // on requête l'API pour obtenir la liste des produits à afficher

  .then(function(res) {
      if (res.ok) {
        return res.json(); // On récupère en format JSON la réponse de l'API si la requête s'est bien passée
      }
    })

  .then(function(value) {

    /* Pour chaque produit du tableau renvoyé par l'API on insère dans le DOM ses caractéristiques pour les afficher sur la page d'accueil */

    for (let product of value) {
      let newItem = document.createElement("div"); // Création de l'élément à insérer dans le DOM

      document.getElementById("items").appendChild(newItem); // Insertion de cet élément en tant qu'enfant de la section regroupant les produits

      newItem.innerHTML = `<a href="./product.html?id=${product._id}"><article><img src="${product.imageUrl}" alt="${product.altTxt}"><h3 class="productName">${product.name}</h3><p class="productDescription">${product.description}</p></article></a>`; // Insertion du HTML contenant les caractéristiques du produit 
    }
  })
}

/* On appelle la fonction */

productsImportation ();