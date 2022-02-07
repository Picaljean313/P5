let str = window.location.href;
let url = new URL (str);
let pageId = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${pageId}`)
.then (function(res){
    if (res.ok){
        return res.json();
    }
})
.then (function(value){
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;
    document.getElementById("title").innerHTML = `${value.name}`;
    document.getElementById("price").innerHTML = `${value.price}`;
    document.getElementById("description").innerHTML = `${value.description}`;

    for (color of value.colors){
        let colorChoice = document.createElement("option");
        colorChoice.setAttribute("value", `${color}`)
        document.getElementById("colors").appendChild(colorChoice);
        colorChoice.innerHTML = `${color}`;
    }
})

if (localStorage.length !== 0){
    cart = JSON.parse(localStorage.getItem("cartItem"));
}
else {
    cart = [];
}

document.getElementById("addToCart").addEventListener("click", function(){

    let colorSelected = document.getElementById("colors").value;
    let quantitySelected = parseFloat(document.getElementById("quantity").value);
    let order = {
        id : pageId,
        color : colorSelected,
        quantity : quantitySelected
    };

    if (colorSelected !=="" && quantitySelected >= 1 && quantitySelected <= 100){
        for (let i in cart) {
            if (cart[i].id === order.id && cart[i].color === order.color){
                order.quantity = quantitySelected += cart[i].quantity ;
                cart.splice(i,1);
            }
        }

        cart.push(order);
        localStorage.clear();
        localStorage.setItem("cartItem", JSON.stringify(cart));
    }
})


