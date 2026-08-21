let cart = JSON.parse(localStorage.getItem("cart")) || {};

let total = 0;
let cartCount = 0;

for (let itemName in cart) {

    const quantity = cart[itemName].quantity;
    const price = cart[itemName].price;

    cartCount += quantity;
    total += quantity * price;
}

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
    localStorage.setItem("cart", JSON.stringify(cart));

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
    <h3>${itemName}</h3>
    <p>Price: ₹${price}</p>

    <div class="quantity-controls">
        <button class="quantity-btn"
            onclick="decreaseQuantity('${itemName}')">
            −
        </button>

        <span class="quantity">${quantity}</span>

        <button class="quantity-btn"
            onclick="increaseQuantity('${itemName}')">
            +
        </button>
    </div>

    <button class="remove-btn"
        onclick="removeItem('${itemName}')">
        Remove
    </button>
`;

        cartItems.appendChild(item);
    }

    document.getElementById("total")
        .textContent =
        "Total: ₹" + total;
}
function increaseQuantity(itemName) {

    cart[itemName].quantity++;

    total += cart[itemName].price;
    cartCount++;

    document.getElementById("cart-count").textContent = cartCount;
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
}
function decreaseQuantity(itemName) {

    if(cart[itemName].quantity > 1) {

        cart[itemName].quantity--;

        total -= cart[itemName].price;
        cartCount--;

        document.getElementById("cart-count").textContent = cartCount;
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
    }
}

async function checkout() {

    const message =
        document.getElementById("message");

    if (cartCount === 0) {

        message.textContent =
            "⚠️ Your cart is empty!";

        return;
    }

    const orderId =
        "CAN" + Date.now();

    const order = {

        orderId: orderId,

        items: Object.keys(cart).map(itemName => ({
            name: itemName,
            price: cart[itemName].price,
            quantity: cart[itemName].quantity
        })),

        total: total
    };

    try {

        const response =
            await fetch("http://localhost:5000/api/orders", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(order)
            });

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        message.innerHTML = `
            ✅ Order placed successfully!<br>
            Order ID: <strong>${data.order.orderId}</strong><br>
            Total: ₹${data.order.total}<br>
            Status: ${data.order.status}
        `;

        // Clear cart

        cart = {};
        total = 0;
        cartCount = 0;

        localStorage.removeItem("cart");

        document.getElementById("cart-count")
            .textContent = "0";

        renderCart();

    } catch (error) {

        console.error("Order error:", error);

        message.textContent =
            "❌ Failed to place order. Please try again.";
    }
}
function removeItem(itemName){

    const quantity =
        cart[itemName].quantity;

    const price =
        cart[itemName].price;

    total -= quantity * price;

    cartCount -= quantity;

    delete cart[itemName];

    localStorage.setItem("cart", JSON.stringify(cart));

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
async function loadProducts() {

    try {

        const response =
            await fetch("http://localhost:5000/api/products");

        const products =
            await response.json();

        const menuContainer =
            document.getElementById("menu-container");

        menuContainer.innerHTML = "";

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "food-card";

            card.dataset.category =
                product.category;

            card.innerHTML = `
                <img src="${product.image}"
                     alt="${product.name}">

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <button
                    onclick="addToCart('${product.name}', ${product.price})"
                    class="order-btn">
                    Add to Cart
                </button>
            `;

            menuContainer.appendChild(card);
        });

    }
    catch(error) {

        console.error("Error loading products:", error);

    }
}
loadProducts();

renderCart();

document.getElementById("cart-count").textContent = cartCount;
renderCart();

document.getElementById("cart-count").textContent = cartCount;
fetch("http://localhost:5000/api/products")
    .then(response => response.json())
    .then(products => {

        console.log("Products from backend:", products);

        const menuContainer =
            document.querySelector(".menu-container");

        menuContainer.innerHTML = "";

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "food-card";

            card.dataset.category = product.category;

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <button
                    class="order-btn"
                    onclick="addToCart('${product.name}', ${product.price})">
                    Add to Cart
                </button>
            `;

            menuContainer.appendChild(card);
        });

    })
    .catch(error => {
        console.error("Error fetching products:", error);
    });
    function loadOrders() {

    fetch("http://localhost:5000/api/orders")
        .then(response => response.json())
        .then(orders => {

            const container =
                document.getElementById("orders-container");

            container.innerHTML = "";

            if (orders.length === 0) {

                container.innerHTML =
                    "<p>No orders yet.</p>";

                return;
            }

            orders.forEach(order => {

                const orderCard =
                    document.createElement("div");

                orderCard.className = "order-card";

                orderCard.innerHTML = `
                    <h3>Order ID: ${order.orderId}</h3>

                    <p>
                        Total: ₹${order.total}
                    </p>

                    <p>
                        Status: ${order.status}
                    </p>

                    <p>
                        Date: ${new Date(order.date).toLocaleString()}
                    </p>

                    <h4>Items</h4>
                `;

                order.items.forEach(item => {

                    const itemElement =
                        document.createElement("p");

                    itemElement.textContent =
                        `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`;

                    orderCard.appendChild(itemElement);

                });

                container.appendChild(orderCard);

            });

        })
        .catch(error => {

            console.error(
                "Error loading orders:",
                error
            );

        });
}
loadOrders();