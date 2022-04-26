/* De la même manière que pour la page produit, on récupère l'identifiant de commande dans l'URL de la page de commande */

function orderIdResearch () {
    let currentOrderPage = window.location.href; // On récupère le lien de la page actuelle

    let currentOrderPageUrl = new URL (currentOrderPage); // On transforme ce lien en URL

    return currentOrderPageUrl.searchParams.get("orderId"); // On récupère l'identifiant de la commande de la page
}

let orderId = orderIdResearch (); // On définit l'identifiant de la commande de la page


/* On insère le numéro de commande dans le DOM pour l'afficher au client */

document.getElementById("orderId").innerHTML = `${orderId}`; 