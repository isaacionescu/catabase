// main site:                      https://cataas.com
// random cat:                     https://cataas.com/cat
// example of an individual cat:   https://cataas.com/cat/595f280e557291a9750ebf9f
// JSON collection of all cats:    https://cataas.com/api/cats
// JSON collection w/ filtering:   https://cataas.com/api/cats?tags=cute
// JSON w/ advanced filtering:     https://cataas.com/api/cats?tags=tag1,tag2&skip=0&limit=10
 
const allCatsURL = "https://cataas.com/api/cats";

const catsSection = document.querySelector(".cats-section");
const fixedFrame = document.querySelector(".fixed-frame")
let unorderedList = document.querySelector("ul");
let rangeLabel = document.querySelector("#range-label");
let allRangeInputValues = document.querySelectorAll("option");
let allCheckboxes = document.getElementsByClassName("checkbox-item");
let allScenes;

const firstPage = document.querySelector(".first-page");
const prevPage = document.querySelector(".prev-page");
let curPage = document.querySelector(".cur-page");
let lastPage = document.querySelector(".last-page");
const nextPage = document.querySelector(".next-page");
 
let maxCats = 13; // global ceiling of cats to be used for our tags, and to be displayed on our page
let selectedTags = []; // this array will contain all currently selected tags, live
let allPossibleSelectedTags = []; // auxiliary variable, used to temporarily store the max # of selected tags, for when the user "Selects all"
let allCards = [];
let currentIndex = 0;
let counter = 0;
let screenSizeIsMobile = false;
const colors = ['red', 'orange', 'green', 'blue'];


async function fetchCats() {
	const response = await fetch(allCatsURL);
	return await response.json();
}

async function doWork() {
	try {
		// 1. this gives us all the imported cat content from the API
		// 2. we create a dropdown menu, providing the function with an argument equal to the total number of cats from the API
		// 3. we set the ceiling limit for our local use - how many cats do we use for making tags, and for the cats grid (for now)?
		// 4. we then pass this number to a function that creates our own local tags array and sorts it. The return value of that function we store inside the variable below, in order to find out what are all the tags the user is able to "Select all" right now?
		// 5. we retrieve cat data (up to our ceiling), we generate divs for the image, title and text, and we store them inside this variable for later use
		// 6. we add event listeners for different click events
		// 7. finally, we render the cats on the DOM, with default settings (they need to be displayed anyway, prior to any subsequent filtering)
		const rawCats = await fetchCats(); 
		createDropdownLimiterMenu(rawCats.length);
		const myCats = rawCats.slice(0, maxCats);
		allPossibleSelectedTags = configureMyTagsArray(myCats);
		allCards = myCats.map((rawCat, i) => createCards(rawCat, i));

		checkScreenSize()
		renderCats();
		document.body.addEventListener("click", onDocumentClick);
		allScenes = document.getElementsByClassName('scene')
	} 
	catch (error) { console.error(error) }
};
doWork();

function checkScreenSize() {
		let mediaQuery = window.matchMedia('(max-width:700px)')
		function onScreenSizeChange(event) {
			if(event.matches) {
				console.log(`It's mobile`)
				screenSizeIsMobile = true;
			}
			else if (!event.matches) {
				console.log(`It's the desktop`)
				screenSizeIsMobile = false;
			}
			renderCats()
		}
		mediaQuery.addListener(onScreenSizeChange)
		onScreenSizeChange(mediaQuery)
}

function onDocumentClick(event) {
	if (event.target.matches(".checkbox-item")) {
		const tag = event.target.id;
		switch (event.target.checked) {
			case true:
				selectedTags.push(tag);
				break;
			case false:
				selectedTags = selectedTags.filter(element => element != tag);
				break;
		}
		// console.log(selectedTags)
		renderCats()
	}

	if (event.target.matches(".tags-clear")) { 
		selectedTags = [];
		for (box of allCheckboxes) { box.checked = false };
		// console.log(selectedTags)
		renderCats()
	}

	if (event.target.matches(".tags-all")) {
		selectedTags = allPossibleSelectedTags;
		for (box of allCheckboxes) { box.checked = true };
		// console.log(selectedTags)
		renderCats()
	}

	// If you click on the dropdown menu, use the inputted value to alter the maxCats state variable, then reinitialize the whole cat grid content
	// I didn't manage to make a distinction between simply opening the dropdown #range-label element, and selecting a specific <option> value. So I used this workaround as a patch. First time you click (to open range) it does nothing, and every other time it does.
	if (event.target.matches("#range-label")) {
		if(counter % 2) {
			maxCats = parseInt(event.target.value)
			doWork()
		};
		counter++;
	}

	if(event.target.matches(".nav")) {
		configureNavigationActions(event)
	}
};



function createDropdownLimiterMenu(totalCats) {
	// 1. this deletes all previously generated <option> values from the dropdown "Limit cats" - otherwise they keep accumulating on each calling of doWork()
	// 2. then we create all 500 values for our dropdown menu (so the user has the power to select as many cats as the external API provides)
	// 3. then we force the program to remember and stick to the last selected value from the dropdown menu
	rangeLabel.innerHTML = "";
	generateValuesForDropdownMenu(totalCats)
	let allRangeInputValues = document.querySelectorAll("option");
	allRangeInputValues[maxCats].setAttribute('selected', true)
}

function generateValuesForDropdownMenu(totalCats) {
		for (let i = 0; i < totalCats; i++) {
			const newRangeInput = document.createElement("option");
			newRangeInput.setAttribute('value', i);
			// newRangeInput.classList.add('range-value'); // this doesn't work for some reason
			newRangeInput.innerHTML = i;
			rangeLabel.appendChild(newRangeInput)
		}	
	}

function configureMyTagsArray(cats) {
	// to-do: add a RegEx to compensate for the spacing tag issue starting from cat #14
	const allTagsFromCats = cats.map((cat) => cat.tags).flat();
	const sortedTags = [...new Set(allTagsFromCats)].sort(); // removed duplicates + sorted alphabetically
	deleteAllVisibleCheckboxes()
	sortedTags.forEach(createCheckboxes);
	return sortedTags
};


function deleteAllVisibleCheckboxes()  {
		unorderedList.innerHTML = ""
	}

function createCheckboxes(tag) {
		const newCheckBox = document.createElement("input");
		newCheckBox.classList.add("checkbox-item");
		newCheckBox.type = "checkbox";
		newCheckBox.name = tag;
		newCheckBox.id = tag;
	 
		const newLabel = document.createElement("label");
		newLabel.setAttribute('for', tag)
		newLabel.id = tag;
		newLabel.innerText = ` ${tag}`;
	 
		const newLi = document.createElement("li");
		newLi.classList.add("list-item")
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
	curPage.innerHTML = `  ${currentIndex + 1} `		
}

 
function renderCats() {
	deleteAllVisibleCats();
 	
 	// determine which of the cards to display on the DOM? See if each card contains any of the currently selected tags, and then decide.
	let selectedCards = selectedTags.length 
		? allCards.filter((cat) => 
				cat.tags.some((tag) =>
					selectedTags.find((selectedTag) => selectedTag === tag)
			)
		)
		: allCards;
	// console.log(`selectedTags:`)
	// console.log(selectedTags)
	// console.log(`selectedCards:`)
	// console.log(selectedCards)
	let curCats = selectedCards.length
	console.log(`And now is it mobile? ${screenSizeIsMobile}`)

	// x = columns; y = rows;
	let x = 4; let y = 1; let maxFit = x * y;  // 4
	let totalScenes = (curCats > maxFit) ? parseInt(curCats / maxFit) : 1;
	// console.log(`totalScenes: ${totalScenes}`) // 3
	let remainder = (curCats >= maxFit) ? curCats - (totalScenes * maxFit) : curCats;
	// console.log(`remainder: ${remainder}`)     // 1

	deleteAllVisibleScenes()
	// console.log(selectedCards.length)
	// if(remainder > 0) {
		for (let i = 0; i <= totalScenes; i++) {
			const slicedCardsArray = [...selectedCards.slice(0, maxFit)]
			selectedCards = [...selectedCards.slice(maxFit)]
			// console.log(selectedCards)
			// if(selectedCards.length > 0) {
				// console.log(`selectedCards wasn't empty this time!`)

				const newScene = createNewScene(slicedCardsArray, i, x, y)
				fixedFrame.appendChild(newScene)
			// }
		} 
	// }
	curPage.innerHTML = `  1`
	lastPage.innerHTML = `  ${(curCats > maxFit) ? totalScenes + 1 : 1}`
}

function deleteAllVisibleScenes() {
	fixedFrame.innerHTML = ""
}

function createNewScene(cards, i, x, y) {
	const newScene = document.createElement('div')
	newScene.classList.add("scene")
	newScene.id = `scene-${i+1}`;
	// newScene.style.backgroundColor = colors[i]

	if(!screenSizeIsMobile) {
		newScene.style.display = i ? "none" : "grid"
		newScene.style.gridTemplateColumns = `repeat(${x}, 17vw)`;
		newScene.style.gridTemplateRows = `repeat(${y}, 17vw)`;	
	}
	else if (screenSizeIsMobile) {
		newScene.style.display = i ? "none" : "grid"
		newScene.style.gridTemplateColumns = `repeat(1, 20vw)`;
		newScene.style.gridTemplateRows = `repeat(1, 20vw)`;
	}

	cards.forEach((card) => {
		const newCard = addCardsToScene(card, newScene)
		newScene.appendChild(newCard)
	}
	);
	return newScene
}
	 
function addCardsToScene(cat, newScene) {
	// console.log(cat)
	const newCard = document.createElement("div");
	newCard.classList.add("cat-card");
 
	const catImage = cat.catImageDiv;
	const catTitle = cat.catTitleDiv;
	const catText = cat.catTextDiv;
	catTitle.innerText = `Cat #${cat.id}`;
 
	newCard.appendChild(catImage);
	newCard.appendChild(catTitle);
	newCard.appendChild(catText);
	return newCard
}

function deleteAllVisibleCats() {
	let fixedFrame = document.getElementsByClassName("fixed-frame")
	fixedFrame.innerHTML = "";
	// let allCatItems = document.getElementsByClassName("cat-card");
	// 	for (let cat of allCatItems) {
	// 		cat.style.display = "none";
	// 	}
}
 
function createCards(data, i) {
	const catImage = document.createElement("div");
	catImage.classList.add("cat-image");
	data.tags.forEach((tag) => catImage.classList.add(tag));
	catImage.id = data.id;
	const catTitle = document.createElement("div");
	catTitle.classList.add("cat-title");
	const catText = document.createElement("div");
 
	catText.classList.add("cat-text");
	catText.id = catImage.id;
 
	catImage.style.background = `url(https://cataas.com/cat/${data.id}) 30% 40%`;
	catText.innerHTML = `Tags: <br>${data.tags.join(", ")}`;
 
	return {
	"id": i + 1,
	"uniqueId": catImage.id,
	"tags": data.tags,
	"catImageDiv": catImage,
	"catTitleDiv": catTitle,
	"catTextDiv": catText
	};
}