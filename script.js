let total = 0;
let cartCount = 0;

let cart = {};

function addToCart(itemName, price){

    const emptyCart =
        document.getElementById("empty-cart");

    if(emptyCart){
        emptyCart.remove();
    }

    total += price;
    cartCount++;

    const badge =
        document.getElementById("cart-count");

    badge.textContent = cartCount;

    badge.style.transform = "scale(1.3)";

    setTimeout(() => {
        badge.style.transform = "scale(1)";
    }, 200);

    if(cart[itemName]){
        cart[itemName].quantity++;
    }
    else{
        cart[itemName] = {
            price: price,
            quantity: 1
        };
    }

    renderCart();
}
function renderCart(){

    const cartItems =
        document.getElementById("cart-items");

    cartItems.innerHTML = "";

    for(let itemName in cart){

        const item =
            document.createElement("div");

        const quantity =
            cart[itemName].quantity;

        const price =
            cart[itemName].price;

        item.innerHTML = `
            ${itemName} x${quantity} - ₹${quantity * price}
            <button class="remove-btn" onclick="removeItem('${itemName}')">
                ❌
            </button>
        `;

        cartItems.appendChild(item);
    }

    document.getElementById("total")
        .textContent =
        "Total: ₹" + total;
}

function checkout(){

    const message =
        document.getElementById("message");

    if(cartCount === 0){
        message.textContent =
            "⚠️ Your cart is empty!";
        return;
    }

    message.textContent =
        "✅ Order placed successfully!";
}
function removeItem(itemName){

    const quantity =
        cart[itemName].quantity;

    const price =
        cart[itemName].price;

    total -= quantity * price;

    cartCount -= quantity;

    delete cart[itemName];

    document.getElementById("cart-count")
        .textContent = cartCount;

    if(cartCount === 0){

        document.getElementById("cart-items")
            .innerHTML =
            '<p id="empty-cart">No items added yet</p>';

        document.getElementById("total")
            .textContent = "Total: ₹0";

        return;
    }

    renderCart();
}
function clearCart(){

    cart = {};
    total = 0;
    cartCount = 0;

    document.getElementById("cart-count")
        .textContent = 0;

    document.getElementById("cart-items")
        .innerHTML =
        '<p id="empty-cart">No items added yet</p>';

    document.getElementById("total")
        .textContent =
        "Total: ₹0";
}
function searchFood(){

    const searchValue =
        document.getElementById("search-box")
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(".food-card");

    cards.forEach(card => {

        const foodName =
            card.querySelector("h3")
            .textContent
            .toLowerCase();

        if(foodName.includes(searchValue)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }
    });
}
function filterFood(category){

    const cards =
        document.querySelectorAll(".food-card");

    cards.forEach(card => {

        if(
            category === "all" ||
            card.dataset.category === category
        ){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });
}