import OAuth from "../scripts/oauth.js";
import Github from "../scripts/github.js";

document.addEventListener("DOMContentLoaded", async function () {
	const isAuthorized = await Github.isAuthorized();

	if (isAuthorized) {
		// chrome.tabs.create({ url: "../setup/setup.html" });
		chrome.action.setPopup({
			popup: "setup/setup.html",
		});
	}
});

document.getElementById("authenticate").addEventListener("click", (event) => {
	OAuth.authenticate();
});
