import Github from "../scripts/github.js";

const repoSelect = document.getElementById("repoSelect");
const repoInput = document.getElementById("repoInput");
const submitButton = document.getElementById("submitButton");

// Load the users repositories into the options
document.addEventListener("DOMContentLoaded", async function () {
	const repositories = await Github.fetchUserRepositories();
	if (Array.isArray(repositories)) {
		repositories.forEach((repo) => {
			const option = document.createElement("option");
			option.value = repo.name;
			option.textContent = repo.name;
			repoSelect.appendChild(option);
		});
	}
});

// Listen for repository selections
document.getElementById("repoSelect").addEventListener("change", function (e) {
	const selectedOption = repoSelect.value;

	if (selectedOption === "new") {
		repoInput.style.display = "block";
		repoInput.required = true;
		submitButton.textContent = "Create Repository";
	} else {
		repoInput.style.display = "none";
		repoInput.required = false;
		submitButton.textContent = "Link Repository";
	}
});

// Listen for for submission
document.getElementById("setupForm").addEventListener("submit", function (e) {
	e.preventDefault();

	// Handle form submission based on the selected option
	const selectedOption = repoSelect.value;
	const repoName = selectedOption === "new" ? repoInput.value : selectedOption;

	if (selectedOption === "new") {
		Github.createRepository();
	}

	chrome.storage.sync.set({ repository: repoName });
});
