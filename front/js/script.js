let cart;

fetch("http://localhost:3000/api/products")
.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    for (let product of value) {
        let newItem = document.createElement("div");
        document.getElementById("items").appendChild(newItem);

        newItem.innerHTML = `<a href="./product.html?id=${product._id}"><article><img src="${product.imageUrl}" alt="${product.altTxt}"><h3 class="productName">${product.name}</h3><p class="productDescription">${product.description}</p></article></a>`;
    }
  })
