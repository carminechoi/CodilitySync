async function displayLinkedRepository() {
	const repoResult = await chrome.storage.sync.get(["repository"]);
	const usernameResult = await chrome.storage.sync.get(["username"]);

	const repo = repoResult.repository;
	const username = usernameResult.username;

	const currentRepo = document.getElementById("currentRepo");

	if (repo && username) {
		currentRepo.textContent = `${username}/${repo}`;
		currentRepo.href = `https://github.com/${username}/${repo}`;
	} else {
		currentRepo.textContent = "No Repository Linked";
		currentRepo.href = "#";
	}
}

displayLinkedRepository();

document.getElementById("changeBtn").addEventListener("click", (event) => {
	chrome.action.setPopup({
		popup: "pages/setup/setup.html",
	});
	window.location.href = "../setup/setup.html";
});
