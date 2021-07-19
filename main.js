// main site:                      https://cataas.com
// random cat:                     https://cataas.com/cat
// example of an individual cat:   https://cataas.com/cat/595f280e557291a9750ebf9f
// JSON collection of all cats:    https://cataas.com/api/cats
// JSON collection w/ filtering:   https://cataas.com/api/cats?tags=cute
// JSON w/ advanced filtering:     https://cataas.com/api/cats?tags=tag1,tag2&skip=0&limit=10
 
const allCatsURL = "https://cataas.com/api/cats";

const catsGrid = document.querySelector(".cats-grid");
const ul = document.querySelector("ul");
let rangeLabel = document.querySelector("#range-label");
let allCheckboxes = document.getElementsByClassName("checkbox-item");
 
let maxCats = 8; // global ceiling of cats to be used for our tags, and to be displayed on our page
let selectedTags = []; // this array will contain all currently selected tags, live
let allPossibleSelectedTags = []; // auxiliary variable, used to temporarily store the max # of selected tags, for when the user "Selects all"
let allCards = [];
let rangeCounter = 0;

rangeLabel.val = maxCats // I tried to set a default value for the range


async function fetchCats() {
	const response = await fetch(allCatsURL);
	return await response.json();
}

async function doWork() {
	try {
		// this gives us the first [maxCats] from the rawCats array
		const rawCats = await fetchCats(); 

		// this deletes all previously generated <option> values from the dropdown "Limit cats" - otherwise they keep accumulating on each calling of doWork()
		rangeLabel.innerHTML = "";

		// then we create all 500 values for our dropdown menu (so the user has the power to select as many cats as the external API provides)
		createValuesForDropdownMenu(rawCats.length)

		// we set the ceiling limit for our local use - how many cats do we use for making tags, and for the cats grid, for now? (until otherwise requested)
		const myCats = rawCats.slice(0, maxCats);

		// we then pass this number to a function that does sorting and clean-up. The return value of that function we store inside the variable below to find out, what are all the tags the user is able select right now? (that number is later used in the "Select all" function)
		allPossibleSelectedTags = configureTagsArray(myCats);

		// we retrieve cat data (up to our ceiling), we generate divs for the image, title and text, and we store them inside this variable for later
		allCards = myCats.map((rawCat, i) => createCards(rawCat, i));

		// we add event listeners for different click events
		document.body.addEventListener("click", onDocumentClick);

		// finally, we render the cats on the DOM, with default settings, cause they need to be displayed anyway, prior to any future filtering
		renderCats();
	} 
	catch (error) { console.error(error) }
};
doWork();

function onDocumentClick(event) {
	if (event.target.matches(".checkbox-item")) {
		const tag = event.target.id;
		
		// if you select a checkbox, add that tag to the dynamic array
		if (event.target.checked) { 
			selectedTags.push(tag);
		}

		// if you deselect a checkbox, remove that tag from the dynamic array
		else if (!event.target.checked) { 
			selectedTags = selectedTags.filter(element => element != tag);
		}
		console.log(selectedTags)
	}

	// if you click on "Clear all", empty the array and clear all current checkboxes
	if (event.target.matches(".tags-clear")) { 
		selectedTags = [];
		for (box of allCheckboxes) { box.checked = false };
		console.log(selectedTags)
	}

	// if you click on "Select all", fill the array with all current tags and select all current checkboxes
	if (event.target.matches(".tags-all")) {
		selectedTags = allPossibleSelectedTags;
		for (box of allCheckboxes) { box.checked = true };
		console.log(selectedTags)
	}

	// if you click on the range dropdown, use the inputted value to alter the maxCats state variable, and then reinitialize the whole page
	if (event.target.matches("#range-label")) {
		// I didn't manage to make a distinction between simply opening the dropdown #range-label element, and selecting a specific <option> value,
		// so I used this workaround as a patch. My program will accept the value only once every two clicks,
		// so I'm hoping this will align with how the users will normally use it.
		rangeCounter++
		let doWeApplyValue = rangeCounter % 2 === 0;
		maxCats = doWeApplyValue ? parseInt(event.target.value) : maxCats;
		doWork()
	}
	renderCats()
};

function createValuesForDropdownMenu(maximumCats) {
	for (let i = 1; i <= maximumCats; i++) {
		const newRangeInput = document.createElement("option");
		newRangeInput.setAttribute('value', i);
		// rewRangeInput.id = `range-value-${i}`;
		// newRangeInput.classList.add('range-value');
		newRangeInput.innerHTML = i;
		rangeLabel.appendChild(newRangeInput)
	}
}

function configureTagsArray(cats) {
	// to-do: add a RegEx to compensate for the spacing tag issue starting from cat #14
	const allTagsFromCats = cats.map((rawCat) => rawCat.tags).flat();
	const initialTagsArray = [...new Set(allTagsFromCats)].sort();

	hideAllVisibleCheckboxes()
	initialTagsArray.forEach(createCheckboxes);
	return initialTagsArray
	// .map() does [[gif, funny], [box, gif]]
	// .flat() does [gif, funny, box, gif]
};


function hideAllVisibleCheckboxes()  {
	let allListItems = document.getElementsByClassName("list-item");
	for (let box of allListItems) {
		box.style.display = "none";
	}
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
	ul.appendChild(newLi);
	newLi.appendChild(newCheckBox);
	newLi.appendChild(newLabel);
};
 
function hideAllVisibleCats() {
	let allCatItems = document.getElementsByClassName("cat-item");
	for (let cat of allCatItems) {
		cat.style.display = "none";
	}
}
 
function addVisibleCatToGrid(cat) {
	const newCat = document.createElement("div");
	newCat.classList.add("cat-item");
 
	const catImage = cat.catImageDiv;
	const catTitle = cat.catTitleDiv;
	const catText = cat.catTextDiv;
	catTitle.innerText = `Cat #${cat.id}`;
 
	newCat.appendChild(catImage);
	newCat.appendChild(catTitle);
	newCat.appendChild(catText);
	catsGrid.appendChild(newCat);
}
 
function renderCats() {
	hideAllVisibleCats();
 	
 	// determine which of the cards to display on the DOM? See if each card contains any of the currently selected tags, and decide
	const selectedCards = selectedTags.length 
		? allCards.filter((cat) => 
				cat.tags.some((tag) =>
					selectedTags.find((selectedTag) => selectedTag === tag)
			)
		)
		: allCards;
 
	selectedCards.forEach((cat) => addVisibleCatToGrid(cat));
}
 
function createCards(data, i) {
	const newCat = document.createElement("div");
	newCat.classList.add("cat-item");
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
	const stringifiedTags = data.tags.join(", ");
	catText.innerHTML = `Tags: <br>${stringifiedTags}`;
 
	return {
	"id": i + 1,
	"uniqueId": catImage.id,
	"tags": data.tags,
	"catImageDiv": catImage,
	"catTitleDiv": catTitle,
	"catTextDiv": catText
	};
}