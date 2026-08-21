const loginForm =
    document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =
        document.getElementById("login-email").value;

    const password =
        document.getElementById("login-password").value;

    const message =
        document.getElementById("login-message");

    try {

        const response =
            await fetch("http://localhost:5000/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

        const data =
            await response.json();

        if (!response.ok) {

            message.textContent =
                "❌ " + data.message;

            return;
        }

        message.textContent =
            "✅ " + data.message;

        console.log("Logged in user:", data.user);

    } catch (error) {

        console.error("Login error:", error);

        message.textContent =
            "❌ Unable to connect to server.";
    }

});