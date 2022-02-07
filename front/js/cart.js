if (localStorage.length !== 0){
    cart = JSON.parse(localStorage.getItem("cartItem"));
}
else {
    cart = [];
}

for(let cartOrder of cart){
    let article = document.createElement("article");
    document.getElementById("cart__items").appendChild(article);
    article.classList.add("cart__item");
    article.setAttribute("data-id", cartOrder.id);
    article.setAttribute("data-color", cartOrder.color);
    fetch(`http://localhost:3000/api/products/${cartOrder.id}`)
    .then(function(res){
        if (res.ok){
            return res.json()
        }
    })
    .then(function(value){
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