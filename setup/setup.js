function handleRepository(event) {
	event.preventDefault();
	const repositoryType = document.querySelector(
		'input[name="repositoryType"]:checked'
	).value;
	const repositoryName = document.getElementById("repositoryName").value;

	if (repositoryType === "existing") {
		alert(
			`You selected to link an existing repository with the name: ${repositoryName}`
		);
		// Add your code to handle linking an existing repository here
	} else if (repositoryType === "new") {
		alert(
			`You selected to create a new private repository with the name: ${repositoryName}`
		);
		// Add your code to handle creating a new private repository here
	}
}

document
	.getElementById("welcomeForm")
	.addEventListener("submit", handleRepository);
