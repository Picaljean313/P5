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

let cartItemQuantitiesHtmlCollection = document.getElementsByClassName("itemQuantity");
let cartItemDelationHtmlCollection = document.getElementsByClassName("deleteItem");

window.addEventListener("load", function() {
  console.log(cartItemQuantitiesHtmlCollection.length);
  for(let i = 0; i<cartItemQuantitiesHtmlCollection.length; i++){
    console.log(cartItemQuantitiesHtmlCollection[i]);
  }
  let cartItemQuantitiesArray = Array.from(cartItemQuantitiesHtmlCollection);
  console.log(cartItemQuantitiesArray);


  for(let i in cartItemQuantitiesArray){
    console.log(cartItemQuantitiesArray[i]);
    cartItemQuantitiesArray[i].addEventListener("change", function () {
      let itemId = cartItemQuantitiesArray[i].closest("article").dataset.id;
  
      console.log(itemId);
  
      let itemColor = cartItemQuantitiesArray[i].closest("article").dataset.color;
  
      console.log(itemColor);
  
      let itemQuantity = cartItemQuantitiesArray[i].value;
      let item = {
        id : itemId,
        color : itemColor,
        quantity : itemQuantity
      };
      for (let j in cart) {
        if (cart[j].id === itemId && cart[j].color === itemColor){
          cart.splice(j,1,item);
        }
      }
      localStorage.clear();
      localStorage.setItem("cartItem", JSON.stringify(cart));
  
      console.log(localStorage);
    });
  }


  let cartItemDelationArray = Array.from(cartItemDelationHtmlCollection);
  console.log(cartItemDelationArray);

  for (let k in cartItemDelationArray){
    cartItemDelationArray[k].addEventListener("click", function(){
      let itemId = cartItemDelationArray[k].closest("article").dataset.id;
  
      console.log(itemId);
  
      let itemColor = cartItemDelationArray[k].closest("article").dataset.color;
  
      console.log(itemColor);
      for (let l in cart){
        if (cart[l].id === itemId && cart[l].color === itemColor){
          cart.splice(l,1);
        }
      }
      document.getElementById("cart__items").removeChild(cartItemDelationArray[k].closest("article"));
      localStorage.clear();
      localStorage.setItem("cartItem", JSON.stringify(cart));
    })
  }

});



