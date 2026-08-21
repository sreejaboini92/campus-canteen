async function loadAdminOrders() {

    try {

        const response =
            await fetch("http://localhost:5000/api/orders");

        const orders =
            await response.json();

        const container =
            document.getElementById("admin-orders");

        container.innerHTML = "";

        if (orders.length === 0) {

            container.innerHTML =
                "<p>No orders available.</p>";

            return;
        }

        orders.forEach(order => {

            const card =
                document.createElement("div");

            card.className = "admin-order-card";

            card.innerHTML = `
                <h3>
                    Order ID: ${order.orderId}
                </h3>

                <p>
                    Total: ₹${order.total}
                </p>

                <p>
                    Current Status:
                    <strong>${order.status}</strong>
                </p>

                <select
                    onchange="updateStatus(
                        '${order._id}',
                        this.value
                    )"
                >

                    <option value="Order Placed"
                        ${order.status === "Order Placed" ? "selected" : ""}>
                        Order Placed
                    </option>

                    <option value="Preparing"
                        ${order.status === "Preparing" ? "selected" : ""}>
                        Preparing
                    </option>

                    <option value="Ready"
                        ${order.status === "Ready" ? "selected" : ""}>
                        Ready
                    </option>

                    <option value="Completed"
                        ${order.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>

                </select>
                <button
    onclick="deleteOrder('${order._id}')">
    Delete Order
</button>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Error loading admin orders:",
            error
        );

    }
}


async function updateStatus(orderId, status) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/orders/${orderId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert(
            "Order status updated successfully!"
        );

        loadAdminOrders();

    } catch (error) {

        console.error(
            "Error updating status:",
            error
        );

        alert(
            "Failed to update order status."
        );

    }
}
async function deleteOrder(orderId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this order?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(`http://localhost:5000/api/orders/${orderId}`, {
    method: "DELETE",

    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert(
            "Order deleted successfully!"
        );

        loadAdminOrders();

    } catch (error) {

        console.error(
            "Error deleting order:",
            error
        );

        alert(
            "Failed to delete order."
        );
    }
}


loadAdminOrders();