import OAuth from "../../content-scripts/oauth.js";
import Github from "../../scripts/github.js";

document.addEventListener("DOMContentLoaded", async function () {
	const isAuthorized = await Github.isAuthorized();

	if (isAuthorized) {
		chrome.action.setPopup({
			popup: "pages/setup/setup.html",
		});
	}
});

document.getElementById("authenticate").addEventListener("click", (event) => {
	OAuth.authenticate();
});
