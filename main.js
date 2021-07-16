// main site:                      https://cataas.com
// random cat:                     https://cataas.com/cat
// example of an individual cat:   https://cataas.com/cat/595f280e557291a9750ebf9f
// JSON collection of all cats:    https://cataas.com/api/cats
// JSON collection w/ filtering:   https://cataas.com/api/cats?tags=cute
// JSON w/ advanced filtering:     https://cataas.com/api/cats?tags=tag1,tag2&skip=0&limit=10
 
const catsGrid = document.querySelector(".cats-grid");
const ul = document.querySelector("ul");
let allCheckboxes = document.getElementsByClassName("tag-item")
const baseUrl = "https://cataas.com";
const allCatsURL = "https://cataas.com/api/cats";
const oneCatURL = "https://cataas.com/cat";
 
const maxCats = 8; // global ceiling of cats to be used on our page
let selectedTags = []; // this array will contain all currently selected tags, live
let allCards = [];
 
async function fetchCats() {
	const response = await fetch(allCatsURL);
	return await response.json();
}

async function doWork() {
	try {
		const rawCats = await fetchCats(); // this gives us the first [maxCats] cats from the rawCats array
		const myCats = rawCats.slice(0, maxCats);
	 
		sortTagsArray(myCats);
		allCards = myCats.map((rawCat, i) => getCard(rawCat, i));
	 
		document.body.addEventListener("click", onCheckboxClick);
		renderCats();
	} catch (error) { console.error(error) }
};
doWork();

function onCheckboxClick(event) {
	if (event.target.matches(".tag-item")) {
			const tag = event.target.id;
			if (event.target.checked) { // if you select a checkbox
				selectedTags.push(tag);
			} 
			else if (!event.target.checked) { // if you deselect a checkbox
			selectedTags = selectedTags.filter(element => element != tag);
		}
	}
	if (event.target.matches(".tags-reset") && selectedTags.length > 0) { // if you click on "Clear all"
		for (box of allCheckboxes) { box.checked = false };
		selectedTags = [];
	}
	renderCats()
};

function sortTagsArray(cats) {
	const allTagsFromCats = cats.map((rawCat) => rawCat.tags).flat();
	const initialTagsArray = [...new Set(allTagsFromCats)].sort();
	initialTagsArray.forEach(createCheckboxes);
	// .map() does [[gif, funny], [box, gif]]
	// .flat() does [gif, funny, box, gif]
};

 
function createCheckboxes(tag) {
	const newCheckBox = document.createElement("input");
	newCheckBox.classList.add("tag-item");
	newCheckBox.type = "checkbox";
	newCheckBox.name = tag;
	newCheckBox.id = tag;
 
	const newLabel = document.createElement("label");
	newLabel.setAttribute('for', tag)
	newLabel.id = tag;
	newLabel.innerText = ` ${tag}`;
 
	const newLi = document.createElement("li");
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
 
	const selectedCards = selectedTags.length 
		? allCards.filter((cat) => 
				cat.tags.some((tag) =>
					selectedTags.find((selectedTag) => selectedTag === tag)
			)
		)
		: allCards;
 
	selectedCards.forEach((cat) => addVisibleCatToGrid(cat));
}
 
function getCard(data, i) {
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