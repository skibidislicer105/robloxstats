const button = document.getElementById("verifyButton");
const status = document.getElementById("status");

button.addEventListener("click", async () => {

    button.disabled = true;
    status.textContent = "Copying...";

    try {

        await navigator.clipboard.writeText("Hello!");

        status.textContent = "Demo verification complete ✓";

        const checkbox = button.querySelector(".checkbox");

        checkbox.textContent = "✓";
        checkbox.style.background = "#222";
        checkbox.style.color = "white";
        checkbox.style.borderColor = "#222";

    } catch (error) {

        console.error("Clipboard error:", error);

        status.textContent =
            "Clipboard access was blocked by your browser.";

        button.disabled = false;
    }
});
