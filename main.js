// main site:                      https://cataas.com
// random cat:                     https://cataas.com/cat
// JSON collection of all cats:    https://cataas.com/api/cats
// JSON collection w/ filtering:   https://cataas.com/api/cats?tags=cute
// JSON w/ advanced filtering:     https://cataas.com/api/cats?tags=tag1,tag2&skip=0&limit=10
// example of an individual cat:   https://cataas.com/cat/595f280e557291a9750ebf9f

const catsGrid = document.querySelector('.cats-grid');
const categoriesForm = document.querySelector('.categories-form');
const ul = document.querySelector('ul');
const baseUrl = 'https://cataas.com';
const allCatsURL = 'https://cataas.com/api/cats';
const oneCatURL = 'https://cataas.com/cat';

let dynamicTagsArray = []; // this array will contain all currently selected tags, live
const maxCats = 8 // universal higher ceiling of cats to be imported from the API in the first place

async function fetchCats() {
    let response = await fetch(allCatsURL);
    let catsArray = await response.json();
    return catsArray;
}


function manipulateImportedCatData() {
	fetchCats()
		.then((rawCatData) => {
			let initialTagsArray = [];
			let catItemsArray = [];

			for (let i = 0; i < maxCats; i++) {
				rawCatData[i].tags.forEach(element => initialTagsArray.push(element)); 

				const newCat = document.createElement('div');
				newCat.classList.add('cat-item');
				const catImage = document.createElement('div');
				catImage.classList.add('cat-image');
				rawCatData[i].tags.forEach(tag => catImage.classList.add(tag))
				catImage.id = rawCatData[i].id
				const catTitle = document.createElement('div');
				catTitle.classList.add('cat-title');
				const catText = document.createElement('div');

				catText.classList.add('cat-text');
				catText.id = catImage.id;

				catImage.style.background = `url(https://cataas.com/cat/${rawCatData[i].id}) 30% 40%`;
				catTitle.innerText = `experiment #${i + 1}`
				catText.innerHTML = `Tags: <br>${rawCatData[i].tags}`

				const newCatObject = {
					"countId": i,
					"uniqueId": catImage.id,
					"tags": rawCatData[i].tags,
					"catImageDiv": catImage,
					"catTitleDiv": catTitle,
					"catTextDiv": catText
				}
				catItemsArray.push(newCatObject);
			}

			initialTagsArray = initialTagsArray.filter((value, index) => initialTagsArray.indexOf(value) === index);
			initialTagsArray = initialTagsArray.sort();

			createCheckboxesForEachTag(initialTagsArray, catItemsArray)
			applyChangesToDOM(catItemsArray);
		})
		.catch(error => console.error(error))
}
manipulateImportedCatData()


function createCheckboxesForEachTag(initialTagsArray, catItemsArray) {
	initialTagsArray.forEach(element => {
		const newCheckBox = document.createElement('input');
		newCheckBox.classList.add('tag-item');
		newCheckBox.type = "checkbox";
		newCheckBox.name = element;
		newCheckBox.id = element;

		const newLabel = document.createElement('label');
		newLabel.for = element;
		newLabel.id = element;
		newLabel.innerText = ` ${element}`;

		const newLi = document.createElement('li');
		ul.appendChild(newLi);
		newLi.appendChild(newCheckBox);
		newLi.appendChild(newLabel);
	})
	filterResultsByTag(catItemsArray)
}


function filterResultsByTag(catItemsArray) {
	console.log(catItemsArray)
	document.addEventListener('click', event => {
		let tag = event.target.id;
		if(event.target.matches('.tag-item')) {
			if (event.target.checked) { // if you select a checkbox
				console.log(`✅ Selected: ${tag}`)
				dynamicTagsArray.push(tag)
			}
			else if (!event.target.checked) { // if you deselect a checkbox
				console.log(`❌ Deselected: ${tag}`)
				dynamicTagsArray = dynamicTagsArray.filter(element => (element != tag));
			}
		applyChangesToDOM(catItemsArray)
		}
	})
}


function applyChangesToDOM (catItemsArray) {
	let allCatItems = document.getElementsByClassName('cat-item');
	console.log(`allCatItems currently on the HTML DOM below:`)
	console.log(allCatItems)
	for (let cat of allCatItems) {
		cat.parentNode.removeChild(cat);
	}
	console.log(`...and after deletion from the DOM you have left:`)
	console.log(allCatItems)

	console.log(`dynamicTagsArray below:`)
	console.log(dynamicTagsArray)
	console.log(`catItemsArray below:`)
	console.log(catItemsArray)

	if(dynamicTagsArray.length > 0) { // if at least one box is checked
		for (let i = 0; i < catItemsArray.length; i++) {
			console.log(`The ${i}th imported cat has the tags below:`)
			console.log(catItemsArray[i].tags)

			let isMatch = false;
			catItemsArray[i].tags.forEach(importedTag => {

				dynamicTagsArray.forEach(selectedTag => {
					if(importedTag === selectedTag) {
						isMatch = true;
						console.log(`🎯 We have a tag match for "${selectedTag}"`)
						return
					}
					else {console.log(`💢 We don't have any tags match for this pic`)}
				})	
			})

			if(isMatch) {
				console.log(catItemsArray[i].catImageDiv)

				const newCat = document.createElement('div');
				newCat.classList.add('cat-item');

				const catImage = catItemsArray[i].catImageDiv;
				const catTitle = catItemsArray[i].catTitleDiv;
				const catText = catItemsArray[i].catTextDiv;

				catTitle.innerText = `Cat #${i + 1}`

				newCat.appendChild(catImage); 
				newCat.appendChild(catTitle); 
				newCat.appendChild(catText);
				catsGrid.appendChild(newCat);
			}

		}

	}

	else { // if no box is currently checked
		console.log(`😪 Currently, no boxes are checked`)
		catItemsArray.forEach((item, index) => {
			const newCat = document.createElement('div');
			newCat.classList.add('cat-item');

			console.log(item.ImageDiv)
			const catImage = item.catImageDiv;
			console.log(item.catTitleDiv)
			const catTitle = item.catTitleDiv;
			const catText = item.catTextDiv;

			catTitle.innerText = `Cat #${index + 1}`

			newCat.appendChild(catImage); 
			newCat.appendChild(catTitle); 
			newCat.appendChild(catText);
			catsGrid.appendChild(newCat);
		}) 
	}
}



// console.log('Test log')