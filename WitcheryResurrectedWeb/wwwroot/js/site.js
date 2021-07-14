let dark = false;
let last;
let index = 0;

function toggleDarkMode() {
    dark = true;
    document.body.classList.toggle("dark-mode");
    document.cookie = "dark_mode=" + dark;
}

async function getDownloads() {
    const result = await fetch("/Home/Downloads/" + (last ? last : ""));
    const downloads = await result.json();
    for (let download of downloads) {
        //TODO add result
    }
}

for (const cookie of document.cookie.replace(" ", "").split("; ")) {
    const entries = cookie.split("=");
    if (entries[0] === "dark_mode" && entries[1] === "true") {
        toggleDarkMode();
    }
}
