import Github from "../scripts/github.js";

// Load the users repositories into the options
document.addEventListener("DOMContentLoaded", function () {
	const repositorySelect = document.getElementById("repositorySelect");
	Github.fetchUserRepositories().then((repositories) => {
		if (Array.isArray(repositories)) {
			repositories.forEach((repo) => {
				const option = document.createElement("option");
				option.value = repo.name;
				option.textContent = repo.name;
				repositorySelect.appendChild(option);
			});
		}
	});
});
