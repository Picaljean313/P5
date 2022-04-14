if (localStorage.length !== 0){
    cart = JSON.parse(localStorage.getItem("cartItem"));
}
else {
    cart = [];
}

let changeTotalQuantityAndPrice = () => {
  let cartItemsHtmlCollection = document.getElementsByClassName("cart__item");
      totalPrice = 0;
      totalQuantity = 0;
      for (let i of cartItemsHtmlCollection){
        let itemPrice = parseFloat(i.querySelector("div.cart__item__content__description p").nextElementSibling.innerHTML.split(' ')[0]);
        let itemQuantity = parseFloat(i.querySelector("input.itemQuantity").value);
        let itemTotalPrice = itemPrice * itemQuantity;
        totalPrice += itemTotalPrice;
        document.getElementById("totalPrice").innerHTML = `${totalPrice}`;
        totalQuantity += itemQuantity;
        document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`;
      }
}

let totalQuantity = 0;
let totalPrice = 0;

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
    totalQuantity += cartOrder.quantity;
    let itemTotalPrice = cartOrder.quantity * value.price;
    totalPrice += itemTotalPrice;
  })
}

window.addEventListener("load", function() {

  let cartItemQuantitiesHtmlCollection = document.getElementsByClassName("itemQuantity");
  let cartItemDelationHtmlCollection = document.getElementsByClassName("deleteItem");

  document.getElementById("totalQuantity").innerHTML = `${totalQuantity}`;
  document.getElementById("totalPrice").innerHTML = `${totalPrice}`;


  let cartItemQuantitiesArray = Array.from(cartItemQuantitiesHtmlCollection);

  for(let i in cartItemQuantitiesArray){
    cartItemQuantitiesArray[i].addEventListener("change", function () {
      let itemId = cartItemQuantitiesArray[i].closest("article").dataset.id;
  
      let itemColor = cartItemQuantitiesArray[i].closest("article").dataset.color;
  
      let itemQuantity = parseFloat(cartItemQuantitiesArray[i].value);
      let item = {
        id : itemId,
        color : itemColor,
        quantity : itemQuantity
      };

      for (let j in cart) {
        if (cart[j].id === itemId && cart[j].color === itemColor && itemQuantity !== 0){
          cart.splice(j,1,item);
          changeTotalQuantityAndPrice();
        }
        if (cart[j].id === itemId && cart[j].color === itemColor && itemQuantity === 0){
          cart.splice(j,1);
          document.getElementById("cart__items").removeChild(cartItemQuantitiesArray[i].closest("article"));
          changeTotalQuantityAndPrice();
        }
      }
      localStorage.clear();
      localStorage.setItem("cartItem", JSON.stringify(cart));
      
      
    });
  }


  let cartItemDelationArray = Array.from(cartItemDelationHtmlCollection);

  for (let k in cartItemDelationArray){
    cartItemDelationArray[k].addEventListener("click", function(){
      let itemId = cartItemDelationArray[k].closest("article").dataset.id;
  
      let itemColor = cartItemDelationArray[k].closest("article").dataset.color;
  
      for (let l in cart){
        if (cart[l].id === itemId && cart[l].color === itemColor){
          cart.splice(l,1);
        }
      }
      document.getElementById("cart__items").removeChild(cartItemDelationArray[k].closest("article"));
      localStorage.clear();
      localStorage.setItem("cartItem", JSON.stringify(cart));

      changeTotalQuantityAndPrice();

    })
  }

});


let validation = false;

let nameAndCityMask = /[^A-Za-z\-'\s]/g;
let addressMask = /[^A-Za-z0-9\-'\s]/g;
let emailMask = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(validation);

document.getElementById("firstName").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("firstName").value)){
    document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez renseigner votre prénom en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe";
    validation = false;
  }
  else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
    validation = true;
  }
  console.log(validation);
})

document.getElementById("lastName").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("lastName").value)){
    document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez renseigner votre nom en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe";
    validation = false;
  }
  else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    validation = true;
  }
  console.log(validation);
})

document.getElementById("address").addEventListener("input", function(){
  if (addressMask.test(document.getElementById("address").value)){
    document.getElementById("addressErrorMsg").innerHTML = "Veuillez renseigner votre addresse en n'utilisant que des lettres sans accents, les chiffres, l'espace blanc, le trait d'union ou l'apostrophe";
    validation = false;
  }
  else {
    document.getElementById("addressErrorMsg").innerHTML = "";
    validation = true;
  }
  console.log(validation);
})

document.getElementById("city").addEventListener("input", function(){
  if (nameAndCityMask.test(document.getElementById("city").value)){
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez renseigner votre ville en n'utilisant que des lettres sans accents, l'espace blanc, le trait d'union ou l'apostrophe";
    validation = false;
  }
  else {
    document.getElementById("cityErrorMsg").innerHTML = "";
    validation = true;
  }
  console.log(validation);
})

document.getElementById("email").addEventListener("input", function(){
  if (emailMask.test(document.getElementById("email").value)){
    document.getElementById("emailErrorMsg").innerHTML = "";
    validation = true;
  }
  else {
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez renseigner votre mail correctement";
    validation = false;
  }
  console.log(validation);
})

document.getElementById("order").addEventListener("click", function(event){
  if (!validation) {
    event.preventDefault();
  }
  else {
    event.preventDefault();
    let contactOrder = {
      firstName : document.getElementById("firstName").value,
      lastName : document.getElementById("lastName").value,
      address : document.getElementById("address").value,
      city : document.getElementById("city").value,
      email : document.getElementById("email").value
    };
    console.log(contactOrder);

    let productsOrder = [];

    for (let i in cart){
      productsOrder.push(cart[i].id);
    }



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
      console.log(value);
      document.location.href=`../html/confirmation.html?orderId=${value.orderId}`;
    });


  }
})

