import OAuth from "../scripts/oauth.js";

document.getElementById("authenticate").addEventListener("click", (event) => {
	OAuth.authenticate();
});
