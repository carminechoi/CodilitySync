async function displayLinkedRepository() {
	const { repository, username } = await chrome.storage.sync.get([
		"repository",
		"username",
	]);

	const currentRepository = document.getElementById("currentRepo");

	if (repository && username) {
		currentRepository.textContent = `${username}/${repository}`;
		currentRepository.href = `https://github.com/${username}/${repository}`;
	} else {
		currentRepository.textContent = "No Repository Linked";
		currentRepository.href = "#";
	}
}

displayLinkedRepository();

document.getElementById("changeBtn").addEventListener("click", (event) => {
	chrome.action.setPopup({
		popup: "pages/setup/setup.html",
	});
	window.location.href = "../setup/setup.html";
});
