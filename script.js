const button = document.getElementById("verifyButton");
const status = document.getElementById("status");

button.addEventListener("click", async () => {
    button.disabled = true;
    status.textContent = "Copying...";

    const text = "Hello!";

    try {
        // Modern Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for browsers where Clipboard API isn't available
            const textarea = document.createElement("textarea");

            textarea.value = text;

            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "-9999px";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            const successful =
                document.execCommand("copy");

            textarea.remove();

            if (!successful) {
                throw new Error("Copy command failed");
            }
        }

        status.textContent = "Copied ✓";

        const checkbox =
            button.querySelector(".checkbox");

        checkbox.textContent = "✓";
        checkbox.style.background = "#222";
        checkbox.style.color = "white";
        checkbox.style.borderColor = "#222";

    } catch (error) {

        console.error("Clipboard error:", error);

        status.textContent =
            "Copy was blocked by the browser.";

        button.disabled = false;
    }
});
