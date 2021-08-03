const allCatsURL = "https://cataas.com/api/cats";
const catsSection = document.querySelector(".cats-section");
const fixedFrame = document.querySelector(".fixed-frame");
const hamburgerMenu = document.querySelector(".hamburger-menu");

let header = document.querySelector('header');
let main = document.querySelector('main');
let footer = document.querySelector('footer');
let sidebar = document.querySelector(".sidebar");

let hamburgerIcon = document.querySelector(".hamburger-icon");
let	unorderedList;
let	allCheckboxes;
let allScenes;

const firstPage = document.querySelector(".first-page");
const prevPage = document.querySelector(".prev-page");
const nextPage = document.querySelector(".next-page");
let curPage = document.querySelector(".cur-page");
let lastPage = document.querySelector(".last-page");
 
let maxCats = 13; // global ceiling of cats to be used for our tags, and to be displayed on our page
let currentOption = 0;
let selectedTags = []; // this array will contain all currently selected tags, live
let allPossibleSelectedTags = []; // auxiliary variable, used to temporarily store the max # of selected tags, for when the user "Selects all"
let allCards = [];
let currentIndex = 0;
let screenSizeIsMobile = false;
let sidebarIsOpen = false;
const colors = ['red', 'orange', 'green', 'blue'];


async function fetchCats() {
	const response = await fetch(allCatsURL);
	return await response.json();
}

async function doWork() {
	try {
	let explanationComment =  {
		// 1. this gives us all the imported cat content from the API
		// 2. we create a dropdown menu, providing the function with an argument equal to the total number of cats from the API
		// 3. we set the ceiling limit for our local use - how many cats do we use for making tags, and for the cats grid (for now)?
		// 4. we then pass this number to a function that creates our own local tags array and sorts it. The return value of that function we store inside the variable below, in order to find out what are all the tags the user is able to "Select all" right now?
		// 5. we retrieve cat data (up to our ceiling), we generate divs for the image, title and text, and we store them inside this variable for later use
		// 6. we add event listeners for different click events
		// 7. finally, we render the cats on the DOM, with default settings (they need to be displayed anyway, prior to any subsequent filtering)
	}
		checkScreenSize()
		const rawCats = await fetchCats(); 
		createDropdownMenu(rawCats.length);
		const myCats = rawCats.slice(0, maxCats);
		allPossibleSelectedTags = configureMyTagsArray(myCats);
		allCards = myCats.map((rawCat, i) => createCard(rawCat, i));
		allCheckboxes = document.getElementsByClassName("checkbox-input");
		renderCats();

		document.body.addEventListener("click", onDocumentClick);
		allScenes = document.getElementsByClassName('scene')
	} 
	catch (error) { console.error(error) }
};
doWork();

function checkScreenSize() {
	let mediaQuery = window.matchMedia('(max-width:1199px)');
	function onScreenSizeChange(event) {
		if(event.matches) {
			// console.log(`It's mobile`);
			screenSizeIsMobile = true;
		}
		else if (!event.matches) {
			// console.log(`It's desktop`);
			sidebar = document.querySelector(".sidebar");
			if(sidebar) { sidebar.parentNode.removeChild(sidebar) };
			screenSizeIsMobile = false;
		}
		renderCats();
	};
	mediaQuery.addListener(onScreenSizeChange);
	onScreenSizeChange(mediaQuery);
};

function toggleSidebar() {
	sidebar.classList.toggle("make-invisible");
	[header, main, footer].forEach(element => element.classList.toggle("make-dark"));
	sidebarIsOpen = !sidebarIsOpen;
};

function onDocumentClick(event) {
	if(event.target.matches(".hamburger-icon") || sidebarIsOpen && !event.target.closest(".sidebar") ) {
		toggleSidebar();
	};

	if (event.target.matches(".range-select")) {
		// ATTENTION! event.target.value is a string
		if(event.target.value == currentOption) {
			console.log('// Nothing changed')
		}
		else { 
			console.log('// Something changed')
			currentOption = parseInt(event.target.value);
			maxCats = parseInt(event.target.value);
			// console.log(event.target[currentOption].selected)
			// event.target[currentOption].selected = true
			doWork();
		};
	};

	if (event.target.closest(".checkbox-input")) {
		switch (event.target.checked) {
			case true:
				selectedTags.push(event.target.id);
				break;
			case false:
				selectedTags = selectedTags.filter(element => element != event.target.id);
				break;
		};
		renderCats();
	};

	if (event.target.closest(".tags-clear-and-all")) {
		switch (event.target.className) {
			case "tags-clear":
				selectedTags = [];
				for (box of allCheckboxes) { box.checked = false };
				break;
			case "tags-all":
				selectedTags = allPossibleSelectedTags;
				for (box of allCheckboxes) { box.checked = true };
				break;
		}
		renderCats();
	}

	if(event.target.matches(".nav")) {
		configureNavigationActions(event);
	};
};


function createDropdownMenu(totalCats) {
let explanationComment2 = {
	// 1. this deletes all previously generated <option> values from the dropdown "Limit cats" - otherwise they keep accumulating on each calling of doWork()
	// 2. then we create all 500 values for our dropdown menu (so the user has the power to select as many cats as the external API provides)
	// 3. then we force the program to remember and stick to the last selected value from the dropdown menu
}
	let	rangeSelect = document.querySelector(".range-select");
	rangeSelect.innerHTML = "";
	generateValuesForDropdownMenu(totalCats, rangeSelect)
	let	allRangeOptions = document.querySelectorAll(".range-option");
	currentOption = maxCats;
	allRangeOptions[currentOption].setAttribute('selected', true);
};


function generateValuesForDropdownMenu(totalCats, rangeSelect) {
		for (let i = 0; i < totalCats; i++) {
			const newOptionInput = document.createElement("option");
			newOptionInput.setAttribute('value', i);
			newOptionInput.className = "range-option";
			newOptionInput.id = `individual-option-${i}`;
			newOptionInput.innerHTML = i;
			rangeSelect.appendChild(newOptionInput);
		};
	};


function configureMyTagsArray(cats) {
	const allTagsFromCats = cats.map((cat) => cat.tags).flat();
	const sortedTags = [...new Set(allTagsFromCats)].sort();
	deleteAllVisibleCheckboxes();
	sortedTags.forEach(createCheckboxes);
	return sortedTags;
};


function deleteAllVisibleCheckboxes()  {
		unorderedList = document.querySelector("ul");
		unorderedList.innerHTML = ""
};


function createCheckboxes(tag) {
		const newCheckBox = document.createElement("input");
		newCheckBox.classList.add("checkbox-input");
		newCheckBox.type = "checkbox";
		newCheckBox.name = tag;
		newCheckBox.id = tag;

		const newLabel = document.createElement("label");
		newLabel.setAttribute('for', tag)
		newLabel.className = "checkbox-label";
		newLabel.id = tag;
		newLabel.innerText = ` ${tag}`;

		const newLi = document.createElement("li");
		newLi.classList.add("list-item");
		newLi.appendChild(newCheckBox);
		newLi.appendChild(newLabel);
		unorderedList.appendChild(newLi);
};


function configureNavigationActions(event) {
	allScenes[currentIndex].style.display = "none";
	switch (event.target.id) {
		case ("next-page"):
			currentIndex = allScenes[currentIndex + 1] ? currentIndex + 1 : currentIndex;
			break;	
		case ("prev-page"):
			currentIndex = allScenes[currentIndex - 1] ? currentIndex - 1 : currentIndex;
			break;
		case ("first-page"):
			currentIndex = 0;
			break;
		case ("last-page"):
			currentIndex = allScenes.length -1;
			break;
	}
	allScenes[currentIndex].style.display = "grid";
	curPage.innerHTML = `  ${currentIndex + 1} `;
};


function renderCats() {
	// console.log(`And now is it mobile? ${screenSizeIsMobile}`);
	deleteAllVisibleCats();
	let selectedCards = selectedTags.length 
		? allCards.filter((cat) => 
				cat.tags.some((tag) =>
					selectedTags.find((selectedTag) => selectedTag === tag)
			)
		)
		: allCards;
	let curCats = selectedCards.length;
	deleteAllVisibleScenes();
	prepareScenes(selectedCards, curCats);
};

function deleteAllVisibleCats() {
	let fixedFrame = document.getElementsByClassName("fixed-frame");
	fixedFrame.innerHTML = "";
};


function deleteAllVisibleScenes() {
	fixedFrame.innerHTML = "";
};


function prepareScenes(selectedCards, curCats) {
	// x = columns; y = rows;
	let x = 4; let y = 2; let maxFit = x * y;
	let totalScenes = (curCats > maxFit) ? parseInt(curCats / maxFit) : 1;
	// let remainder = (curCats >= maxFit) ? curCats - (totalScenes * maxFit) : curCats;

	for (let i = 0; i <= totalScenes; i++) {
		const slicedCardsArray = [...selectedCards.slice(0, maxFit)];
		selectedCards = [...selectedCards.slice(maxFit)];
		const newScene = createNewScene(slicedCardsArray, i, x, y);
		newScene.style.display = i ? "none" : "grid";

		switch(screenSizeIsMobile) {
			case true:
				newScene.style.gridTemplateColumns = `repeat(1, 40vw)`;
				newScene.style.gridTemplateRows = `repeat(${maxFit},40vw)`;
				break;
			case false:

				newScene.style.gridTemplateColumns = `repeat(${x}, 14vw)`;
				newScene.style.gridTemplateRows = `repeat(${y}, 14vw)`;	
				break
		};
		fixedFrame.appendChild(newScene);
	};
	const catsSection = document.querySelector('.cats-section');
	catsSection.style.height = "fill";
	curPage.innerHTML = `  1`;
	lastPage.innerHTML = `  ${curCats > maxFit ? totalScenes + 1 : 1}`;
};


function createNewScene(cards, i, x, y) {
	const newScene = document.createElement('div');
	newScene.classList.add("scene");
	newScene.id = `scene-${i+1}`;
	// newScene.style.backgroundColor = colors[i]

	cards.forEach((card) => {
		const newCard = addCardToScene(card, newScene);
		newScene.appendChild(newCard);
	});
	const catsSection = document.querySelector('.cats-section');
	const fixedFrame = document.querySelector('.fixed-frame');
	// catsSection.style.height = "fill";
	// fixedFrame.style.height = "fill"
	// newScene.style.height = "fill"
	return newScene;
};


function addCardToScene(cat, newScene) {
	const newCard = document.createElement("div");
	newCard.classList.add("cat-card");
 
	const catImage = cat.catImageDiv;
	const catTitle = cat.catTitleDiv;
	const catText = cat.catTextDiv;
	catTitle.innerText = `Cat #${cat.id}`;
 
	newCard.appendChild(catImage);
	newCard.appendChild(catTitle);
	newCard.appendChild(catText);
	return newCard;
}


function createCard(data, i) {
	const catImage = document.createElement("div");
	catImage.id = data.id;
	catImage.classList.add("cat-image");
	// Some cats' tags starting with cat #14 have whitespace. In order to make them into HTML classes and add them to each cat card, I gotta replace the whitespace:
	data.tags.forEach((tag) => {
		let regex = /\s/g;
		tag = tag.replace(regex, '-');
		catImage.classList.add(tag);
	});

	const catTitle = document.createElement("div");
	catTitle.classList.add("cat-title");
	const catText = document.createElement("div");
	catText.classList.add("cat-text");
	catText.id = catImage.id;
	catImage.style.background = `url(https://cataas.com/cat/${data.id}) 30% 40% no-repeat`;
	catText.innerHTML = `Tags: <br>${data.tags.join(", ")}`;

	return {
		"id": i + 1,
		"uniqueId": catImage.id,
		"tags": data.tags,
		"catImageDiv": catImage,
		"catTitleDiv": catTitle,
		"catTextDiv": catText
	};
};