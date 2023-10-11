const codilityData = {
	title: getTitle(),
	description: getDescription(),
	difficulty: getDifficulty(),
	language: getLanguage(),
	taskScore: getTaskScore(),
	correctnessScore: getCorrectnessScore(),
	code: getCode(),
};

function getTitle() {
	const titleElement = document.querySelector("#task-0-name");
	const titleText = titleElement?.textContent.trim() ?? "";
	return titleText;
}

function getDescription() {
	const content = document.querySelector(".brinza-task-description");
	const childElements = content.children;

	let description = "";

	for (const child of childElements) {
		description += child.innerHTML + "\n";
	}

	return description;
}

function getDifficulty() {
	const difficultyElement = document.querySelector(".difficulty");
	const difficultyText = difficultyElement?.textContent.trim() ?? "";
	return difficultyText;
}

function getLanguage() {
	const languageElement = document.querySelector(".language_used");
	const languageText = languageElement?.textContent.trim() ?? "";
	return languageText;
}

function getTaskScore() {
	const taskScoreElement = document.querySelector(".progress-bar-0");
	const taskScoreText = taskScoreElement?.textContent.trim() ?? "";
	return taskScoreText;
}

function getCorrectnessScore() {
	const correctnessScoreElement = document.querySelector(
		".progress-bar-correctness-0"
	);
	const correctnessScoreText =
		correctnessScoreElement?.textContent.trim() ?? "";
	return correctnessScoreText;
}

function getCode() {
	let codeText = "";

	const codeContainer = findLastMatchingElement("task-0-submit-");

	if (codeContainer) {
		const codeElement = codeContainer.querySelector("div code");
		codeText = codeElement?.textContent.trim() ?? "";
	}
	return codeText;
}
// Get the last element whose IDs match the pattern
function findLastMatchingElement(pattern) {
	const matchingElements = document.querySelectorAll(`[id^="${pattern}"]`);

	// Check if there are any matching elements
	if (matchingElements.length > 0) {
		// Return the last matching element
		return matchingElements[matchingElements.length - 1];
	}

	// If no matching elements were found, return null
	return null;
}

chrome.runtime.sendMessage({ codilityData: codilityData });