/* On appelle de nouveau la fonction qui définit la valeur de la variable "cart" */

function cartValue () {
  if (localStorage.length !== 0){
    cart = JSON.parse(localStorage.getItem("cartItem"));
  }

  else {
    cart = [];
  }
}

cartValue ();


/* On définit la fonction qui va afficher sur la page les différents éléments du panier */

function cartItemsInformationsImportation () {
  /* Pour chaque produit dans le panier, on créé un "article" dans le DOM avec ses informations */
  for(let cartOrder of cart){
    let article = document.createElement("article");

    document.getElementById("cart__items").appendChild(article);

    article.classList.add("cart__item");

    article.setAttribute("data-id", cartOrder.id);

    article.setAttribute("data-color", cartOrder.color);

    fetch(`http://localhost:3000/api/products/${cartOrder.id}`) // On requête l'API pour récupérer les données de chacun des produits du panier

    .then(function(res){
        if (res.ok){
            return res.json()
        }
    })

    .then(function(value){ 
      /* On insère dans le DOM les informations de chacun des produits du panier */

      article.innerHTML = `<div class="cart__item__img">
        <img src="${value.imageUrl}" alt="${value.altText}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${value.name}</h2>
          <p>${cartOrder.color}</p>
          <p>${value.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartOrder.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>`;
    })
  }
}

/* On appelle la fonction */

cartItemsInformationsImportation();


/* On définit la fonction qui permet d'indiquer la quantité totale de canapés commandés ainsi que le prix total */

function changeTotalQuantityAndPrice () {
  let cartItemsHtmlCollection = document.getElementsByClassName("cart__item"); // On établit l'HtmlCollection des différents "article" créés sur le DOM pour chaque produit

  let totalQuantity = 0;
  let totalPrice = 0; // On définit deux variables de quantité et prix totaux

  for (let i of cartItemsHtmlCollection){ 
    /* On parcourt les éléments de la HtmlCollection pour cumuler les quantités de chacun des produits du panier, de même avec les prix */

    let itemPrice = parseFloat(i.querySelector("div.cart__item__content__description p").nextElementSibling.innerHTML.split(' ')[0]); // On récupère le prix de chaque produit en le prélevant sur le DOM, plutôt que de faire une reqête à l'API

    let itemQuantity = parseFloat(i.querySelector("input.itemQuantity").value);

    let itemTotalPrice = itemPrice * itemQuantity;

    totalPrice += itemTotalPrice;

    totalQuantity += itemQuantity;
  }

  document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`; // On affiche sur le DOM la quantité totale

  document.getElementById("totalPrice").innerHTML = `${totalPrice}`; // On affiche sur le DOM le prix total
}


/* On définit la fonction qui permet de modifier le DOM et le panier lors du changement des quantités par le client directement sur la page panier */

function changeQuantities () {
  let cartItemQuantitiesArray = Array.from(document.getElementsByClassName("itemQuantity")); // On établit le "array" des différents "input" créés sur le DOM pour chaque quantité de produit (et non la "HtmlCollection" qui ne peut accepter les "addEventListener" sur ses éléments)

  for(let i in cartItemQuantitiesArray){
    /* On parcourt chaque "input" du "array" pour repérer les changements réalisés par le client sur la page panier */

    cartItemQuantitiesArray[i].addEventListener("change", function () {
      let itemId = cartItemQuantitiesArray[i].closest("article").dataset.id;
  
      let itemColor = cartItemQuantitiesArray[i].closest("article").dataset.color;
  
      let itemQuantity = parseFloat(cartItemQuantitiesArray[i].value);

      let item = {
        id : itemId,
        color : itemColor,
        quantity : itemQuantity
      }; // On établit le profil du canapé (id, couleur) pour lequel la quantité a été modifiée

      for (let j in cart) {
        /* On compare ce profil avec le contenu du panier pour remplacer l'ancienne quantité commandée par la nouvelle si elle est non nulle */

        if (cart[j].id === itemId && cart[j].color === itemColor && itemQuantity !== 0){
          cart.splice(j,1,item);

          changeTotalQuantityAndPrice(); // On actualise la quantité et le prix totaux
        }

        /* Si la quantité est devenue nulle, on supprime du panier et du DOM ce produit */

        if (cart[j].id === itemId && cart[j].color === itemColor && itemQuantity === 0){
          cart.splice(j,1);

          document.getElementById("cart__items").removeChild(cartItemQuantitiesArray[i].closest("article"));

          changeTotalQuantityAndPrice(); // On actualise la quantité et le prix totaux
        }
      }

      localStorage.clear(); // On supprime les données du localStorage

      localStorage.setItem("cartItem", JSON.stringify(cart)); // On insère le nouveau panier
    });
  }
}


/* On définit la fonction qui permet de modifier le DOM et le panier lors de la suppression d'un produit par le client directement sur la page panier */

function deleteProduct () {
  let cartItemDelationArray = Array.from(document.getElementsByClassName("deleteItem")); // On établit le "array" des différents "p" créés sur le DOM pour chaque bouton "supprimer" de produit 

  for (let k in cartItemDelationArray){
    /* On parcourt chaque "p" du "array" pour repérer les clics réalisés par le client sur la page panier */

    cartItemDelationArray[k].addEventListener("click", function(){
      let itemId = cartItemDelationArray[k].closest("article").dataset.id;
  
      let itemColor = cartItemDelationArray[k].closest("article").dataset.color; // On établit le profil du canapé (id, couleur) que le client ne veut plus commander */

      for (let l in cart){
        /* On compare ce profil avec le contenu du panier pour supprimer la commande de ce type de canapé du DOM et du panier */

        if (cart[l].id === itemId && cart[l].color === itemColor){
          cart.splice(l,1);
        }
      }

      document.getElementById("cart__items").removeChild(cartItemDelationArray[k].closest("article"));

      localStorage.clear(); // On vide le localStorage

      localStorage.setItem("cartItem", JSON.stringify(cart)); // On insère le nouveau panier

      changeTotalQuantityAndPrice(); // On actualise la quantité et le prix totaux
    })
  }
}

/* On attend que la page qui affiche les produits le panier initial soit chargée pour appeler pour la première fois la fonction "changeTotalQuantityAndPrice", et pour appeler les fonctions "changeQuantities" et "deleteProduct", étant donné que l'on doit attendre la réponse de l'API pour ajouter au DOM des éléments que l'on utilise dans celles-ci */

window.addEventListener("load", function() { 

  changeTotalQuantityAndPrice();

  changeQuantities ();

  deleteProduct ();
});


/* On vérifie les données saisies par les utilisateurs avant de soumettre le formulaire */

let validation1 = false;
let validation2 = false;
let validation3 = false;
let validation4 = false;
let validation5 = false; // On définit les variables validation initialement fausse, qui bloquent la soumission du formulaire

let nameAndCityMask = /[^A-Za-z\-'\s]/g; // On établit le masque des caractères que l'on ne veut pas pour les champs "Prénom", "Nom" et "Ville"

let addressMask = /[^A-Za-z0-9\-'\s]/g; // On établit le masque "Adresse" en ajoutant les chiffres par rapport au précédent

let emailMask = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // On établit le masque "Email" pour signaler ce qui n'est pas de la forme "chaîne hors @ et blanc"@"chaîne hors @ et blanc"."chaîne hors @ et blanc"

document.getElementById("firstName").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("firstName").value)){
    document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez renseigner votre prénom en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe"; // si un caractère correspond au masque le message d'erreur apparaît

    validation1 = false; 
  }

  else {
    document.getElementById("firstNameErrorMsg").innerHTML = ""; // On supprime le message d'erreur s'il était apparu avant, sinon rien ne change en cas de bonne complétion

    validation1 = true; // la variable validation devient vraie en cas de bonne complétion de ce champ 
  }
})

document.getElementById("lastName").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("lastName").value)){
    document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez renseigner votre nom en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe";
    validation2 = false;
  }
  else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    validation2 = true;
  }
})

document.getElementById("address").addEventListener("input", function(){
  if (addressMask.test(document.getElementById("address").value)){
    document.getElementById("addressErrorMsg").innerHTML = "Veuillez renseigner votre addresse en n'utilisant que des lettres sans accents, les chiffres, l'espace blanc, le trait d'union ou l'apostrophe";
    validation3 = false;
  }
  else {
    document.getElementById("addressErrorMsg").innerHTML = "";
    validation3 = true;
  }
})

document.getElementById("city").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("city").value)){
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez renseigner votre ville en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe";
    validation4 = false;
  }
  else {
    document.getElementById("cityErrorMsg").innerHTML = "";
    validation4 = true;
  }
})

document.getElementById("email").addEventListener("input", function(){
  if (emailMask.test(document.getElementById("email").value)){
    document.getElementById("emailErrorMsg").innerHTML = "";
    validation5 = true;
  }
  else {
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez renseigner votre mail correctement";
    validation5 = false;
  }
})

/* On paramètre l'envoi du formulaire suivant les cas de figures (et dans tous les cas on bloque l'envoi classique du formulaire, car on veut envoyer les données à l'API avec la méthode POST) */

document.getElementById("order").addEventListener("click", function(event){
  if (!validation1 || !validation2 || !validation3 || !validation4 || !validation5) { // Si une des variables validation est fausse
    event.preventDefault(); 
    
    alert("Veuillez renseigner correctement le formulaire"); // On alerte l'utilisateur de la raison du blocage
  }
  else if (cart.length == 0){ // Dans le cas où le panier est vide
    event.preventDefault(); 

    alert("Votre panier est vide"); // On alerte l'utilisateur de la raison du blocage
  }
  
  else {
    event.preventDefault(); 

    let contactOrder = {
      firstName : document.getElementById("firstName").value,
      lastName : document.getElementById("lastName").value,
      address : document.getElementById("address").value,
      city : document.getElementById("city").value,
      email : document.getElementById("email").value
    }; // On établit l'objet JS contenant les saisies valides de l'utilisateur

    let productsOrder = []; // On définit l'array qui va contenir la commande

    for (let i in cart){
      productsOrder.push(cart[i].id); // On ajoute chaque produit du panier à l'array de commande
    }

    /* On utilise la méthode POST pour envoyer à l'API les données de la commande */

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
      body: JSON.stringify({contact : contactOrder, products : productsOrder})
    }) 

    .then(function(res){
      if (res.ok){
          return res.json()
      }
    })
    .then(function(value){
      document.location.href=`../html/confirmation.html?orderId=${value.orderId}`; // On redirige l'utilisateur vers la page de confirmation avec dans son URL l'identifiant de commande (pour éviter de l'ajouter au localStorage)
    });
  }
})

