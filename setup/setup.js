import Github from "../scripts/github.js";

const repoSelect = document.getElementById("repoSelect");
const repoInput = document.getElementById("repoInput");
const submitButton = document.getElementById("submitButton");

// Load the users repositories into the options
document.addEventListener("DOMContentLoaded", function () {
	Github.fetchUserRepositories().then((repositories) => {
		if (Array.isArray(repositories)) {
			repositories.forEach((repo) => {
				const option = document.createElement("option");
				option.value = repo.name;
				option.textContent = repo.name;
				repoSelect.appendChild(option);
			});
		}
	});
});

// Add an event listener to the form for submission handling
document.getElementById("repoSelect").addEventListener("change", function (e) {
	const selectedOption = repoSelect.value;

	if (selectedOption === "new") {
		repoInput.style.display = "block";
		submitButton.textContent = "Create Repository";
	} else {
		repoInput.style.display = "none";
		submitButton.textContent = "Link Repository";
	}
});
