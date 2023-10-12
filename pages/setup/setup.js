const repoSelect = document.getElementById("repoSelect");
const repoInput = document.getElementById("repoInput");
const newRepositoryForm = document.getElementById("newRepositoryForm");
const submitButton = document.getElementById("submitButton");

// Load the users repositories into the options
document.addEventListener("DOMContentLoaded", function () {
	chrome.runtime.sendMessage(
		{ action: "fetchUserRepositories" },
		(response) => {
			if (Array.isArray(response)) {
				response.forEach((repo) => {
					const option = document.createElement("option");
					option.value = repo.name;
					option.textContent = repo.name;
					repoSelect.appendChild(option);
				});
			}
		}
	);
});

// Listen for repository selection changes
document.getElementById("repoSelect").addEventListener("change", function (e) {
	const selectedOption = repoSelect.value;

	if (selectedOption === "new") {
		newRepositoryForm.style.display = "block";
		repoInput.required = true;
		submitButton.textContent = "Create Repository";
	} else {
		newRepositoryForm.style.display = "none";
		repoInput.required = false;
		submitButton.textContent = "Link Repository";
	}
});

// Listen for for submission
document.getElementById("setupForm").addEventListener("submit", function (e) {
	e.preventDefault();

	// Handle form submission based on the selected option
	const selectedOption = repoSelect.value;
	const privacy = document.querySelector(
		'input[name="repositoryType"]:checked'
	).value;
	const name = selectedOption === "new" ? repoInput.value : selectedOption;

	chrome.runtime.sendMessage({
		action: "submitSetupForm",
		name: name,
		type: selectedOption,
		isPrivacy: privacy == "private",
	});
});
