document.getElementById("authenticate").addEventListener("click", (event) => {
	chrome.runtime.sendMessage({ action: "createOAuthTab" });
});
