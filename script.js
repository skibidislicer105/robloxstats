const copyButton =
    document.getElementById("copyButton");

const copyStatus =
    document.getElementById("copyStatus");

const verifyButton =
    document.getElementById("verifyButton");

const verifyStatus =
    document.getElementById("verifyStatus");


/*
 * STEP 1
 * Copy harmless demo text.
 */

copyButton.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText("Hello!");

        copyButton.textContent =
            "Copied ✓";

        copyStatus.textContent =
            "CAPTCHA code copied to your clipboard.";

        setTimeout(() => {

            copyButton.textContent =
                "Copy CAPTCHA";

        }, 2000);

    } catch (error) {

        console.error(error);

        copyStatus.textContent =
            "Clipboard access was blocked by your browser.";

    }

});


/*
 * STEP 4
 * Safe demo verification.
 */

verifyButton.addEventListener("click", () => {

    verifyButton.disabled = true;

    verifyButton.textContent =
        "Verified ✓";

    verifyStatus.textContent =
        "Demo verification completed successfully.";

});
