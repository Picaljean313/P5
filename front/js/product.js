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
