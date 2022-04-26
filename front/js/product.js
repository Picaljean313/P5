/* On définit la fonction qui indique la valeur de la variable "cart" à chaque étape du parcours utilisateur, que l'on utilisera sur chaque nouvelle page */

function cartValue () {
    if (localStorage.length !== 0){
      cart = JSON.parse(localStorage.getItem("cartItem"));
    } // On récupère dans la variable "cart" les produits mis précédemment au panier par l'utilisateur et conservés dans le localStorage
  
    else {
      cart = []; // On indique que le panier est vide si rien n'a encore été ajouté 
  }
}

/* On appelle cette fonction */

cartValue ();

  
/* On définit la fonction qui va récupérer l'identifiant du produit dans l'URL de la page */

function productIdResearch () {
    let currentProductPage = window.location.href; // On récupère le lien de la page actuelle

    let currentProductPageUrl = new URL (currentProductPage); // On transforme ce lien en URL

    return currentProductPageUrl.searchParams.get("id"); // On récupère l'identifiant du produit de la page
}

let pageId = productIdResearch (); // On définit l'identifiant du produit de la page


/* On définit la fonction qui va récupérer les informations du produit demandé auprès de l'API et les afficher sur la page produit */

function productInformationsImportation () {
    fetch(`http://localhost:3000/api/products/${pageId}`) // On requête l'API pour obtenir les informations du produit voulu

    .then (function(res){
        if (res.ok){
            return res.json();
        }
    })

    .then (function(value){
        /* On insère dans le DOM les informations du produit correspondant */

        document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`; 

        document.getElementById("title").innerHTML = `${value.name}`;  

        document.getElementById("price").innerHTML = `${value.price}`;

        document.getElementById("description").innerHTML = `${value.description}`;

        for (color of value.colors){
            /* On créé dans le DOM pour chaque couleur disponible une option dans la liste déroulante */

            let colorChoice = document.createElement("option");

            colorChoice.setAttribute("value", `${color}`);

            document.getElementById("colors").appendChild(colorChoice);

            colorChoice.innerHTML = `${color}`;
        }
    })
}

/* On appelle la fonction */

productInformationsImportation ();


/* On définit la fonction qui va ajouter la sélection du client au panier */

function addToCart () {
    /* On récupère les informations de la sélection du client au moment du clic sur le bouton "Ajouter au panier" */

    document.getElementById("addToCart").addEventListener("click", function(){
        let colorSelected = document.getElementById("colors").value;

        let quantitySelected = parseFloat(document.getElementById("quantity").value); // On transforme en nombre la valeur de la quantité 

        let order = {
            id : pageId,
            color : colorSelected,
            quantity : quantitySelected
        }; // On créé un objet JS avec les informations de la sélection et les bons types de données 

        if (colorSelected !=="" && quantitySelected >= 1 && quantitySelected <= 100 && Number.isInteger(quantitySelected)){
            /* Dans le cas où la commmande est valide (avec un nombre entier non nul inférieur à 100 et avec une couleur sélectionnée), on vérifie dans le panier s'il y a déjà un canapé similaire pour modifier le nombre commandé ou on ajoute au panier la sélection s'il n'y en a pas */

            for (let i in cart) {
                if (cart[i].id === order.id && cart[i].color === order.color){
                    order.quantity = quantitySelected += cart[i].quantity ; // on modifie la quantité de la commmande de ce canapé s'il existait déjà une commande de celui-ci

                    cart.splice(i,1); // On suprime dans le panier la commande précédente du même canapé
                }
            }

            cart.push(order); // On ajoute au panier la commande 

            localStorage.clear(); // On supprime le panier précédent du localStorage

            localStorage.setItem("cartItem", JSON.stringify(cart)); // On ajoute au localStorage le panier auquel on a ajouté la nouvelle commande
        }
        else {
            alert ("Veuillez choisir une couleur et indiquer une quantité entière comprise entre 1 et 100") // On indique au client pour quoi sa commande est invalide 
        }
    })
}

/* On appelle la fonction d'ajout au panier */

addToCart ();

