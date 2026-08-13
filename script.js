const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");

const verifyButton = document.getElementById("verifyButton");
const verifyStatus = document.getElementById("verifyStatus");


copyButton.addEventListener("click", async () => {

    const text = "Hello!";

    try {

        /*
         * Modern HTTPS clipboard API
         */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(text);

        } else {

            /*
             * Legacy fallback
             */

            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            textarea.setAttribute(
                "readonly",
                ""
            );

            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "0";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            const copied =
                document.execCommand("copy");

            document.body.removeChild(textarea);

            if (!copied) {
                throw new Error(
                    "Fallback copy failed"
                );
            }
        }


        copyButton.textContent =
            "Copied ✓";

        copyStatus.textContent =
            'Copied "Hello!" to your clipboard.';


        setTimeout(() => {

            copyButton.textContent =
                "Copy CAPTCHA";

        }, 2000);


    } catch (error) {

        console.error(
            "Clipboard error:",
            error
        );

        copyStatus.textContent =
            "Copy failed. Check your browser's clipboard permissions.";

    }

});


/* Safe demo verification */

verifyButton.addEventListener("click", () => {

    verifyButton.disabled = true;

    verifyButton.textContent =
        "Verified ✓";

    verifyStatus.textContent =
        "Demo verification completed successfully.";

});
