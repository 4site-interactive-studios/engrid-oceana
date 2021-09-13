// Loads client theme scripts as soon as possible, but never before DOMContentLoaded
if (document.readyState !== "loading") {
    clientScripts();
} else {
    document.addEventListener("DOMContentLoaded", () => {
      clientScripts();
    });
};

function clientScripts(){
    console.log("ENGrid client theme main.js scripts are executing");
    // Add your client theme functions and scripts here
}