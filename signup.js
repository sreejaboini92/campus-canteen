const signupForm =
    document.getElementById("signup-form");

signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("signup-name")
                .value;

        const email =
            document.getElementById("signup-email")
                .value;

        const password =
            document.getElementById("signup-password")
                .value;

        const message =
            document.getElementById("signup-message");

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/signup",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                message.textContent =
                    "❌ " + data.message;

                return;
            }

            message.textContent =
                "✅ " + data.message;

            signupForm.reset();

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            message.textContent =
                "❌ Unable to connect to server.";
        }
    }
);