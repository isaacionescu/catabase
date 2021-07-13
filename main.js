// main site:                    https://cataas.com
// JSON collection of all cats:  https://cataas.com/api/cats
// JSON collection w/ filtering: https://cataas.com/api/cats?tags=cute
// JSON of filtered tags:        https://cataas.com/api/cats?tags=tag1,tag2&skip=0&limit=10
// example of an individual cat: https://cataas.com/cat/595f280e557291a9750ebf9f

const catsGrid = document.querySelector('.cats-grid');
const categoriesForm = document.querySelector('.categories-form');
const ul = document.querySelector('ul');
const baseUrl = 'https://cataas.com';
const apiUrl = 'https://cataas.com/api/cats';
const apiRandom = 'https://cataas.com/cat';


let dynamicTagsArray = [];
const maxCats = 5

async function getCats() {
    let response = await fetch(apiUrl);
    let catsArray = await response.json();
    return catsArray;
};

function fetchCatData() {
	getCats()
		.then((rawCatData) => {
			let tagsArray = [];
			let catDataArray = [];
			for (let i = 0; i < maxCats; i++) {
				rawCatData[i].tags.forEach(element => tagsArray.push(element)); 
				catDataArray.push(rawCatData[i])
			}
			console.log(catDataArray)
			tagsArray = tagsArray.filter((value, index) => tagsArray.indexOf(value) === index);
			tagsArray = tagsArray.sort();

			createCheckboxesForEachTag(tagsArray, catDataArray)
		})
		.catch(error => console.error(error))
}
fetchCatData()


function createCheckboxesForEachTag(tagsArray, catDataArray) {
	tagsArray.forEach(element => {
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
	// fillCatsGrid()
	filterResultsByTag()
}

function filterResultsByTag() {
	document.addEventListener('click', event => {
		let tag = event.target.id;
		if(event.target.matches('.tag-item')) {
			if (event.target.checked) {
				console.log(`✅ Selected: ${tag}`)
				dynamicTagsArray.push(tag)
			}
			else if (!event.target.checked) {
				console.log(`❌ Deselected: ${tag}`)
				dynamicTagsArray = dynamicTagsArray.filter(element => (element != tag));
			}
		// console.log(`// dynamicTagsArray: [${dynamicTagsArray}]`)
		changeDOMToReflectFilteredTags ()
		}
	})
}

function changeDOMToReflectFilteredTags () {
	console.log(`// dynamicTagsArray: [${dynamicTagsArray}]`)

	let allCatItems = document.getElementsByClassName('cat-item');
	console.log(allCatItems)
	for (let cat of allCatItems) {
		cat.parentNode.removeChild(cat);
	}

	// allCatItems.style+= "display: none;";
	// allCatItems.parentNode.removeChild(allCatItems)

	let urlString = dynamicTagsArray.join(',');

	async function getFilteredCats() {
		let response = await fetch(`${apiUrl}?tags=${urlString}&skip=0&limit=${maxCats}`);
		let promise = await response.json();
		return promise;
	}

	getFilteredCats()
		.then(catData => {
			console.log(`// Current dynamicTagsArray: [${dynamicTagsArray}]`)
			console.log(`urlString: ${urlString}`)
			console.log(catData)

			for (let i = 0; i < catData.length; i++) {
				let newCat = document.createElement('div');
				newCat.classList.add('cat-item');

				const catImage = document.createElement('div');
				catImage.classList.add('cat-image');
				const catTitle = document.createElement('div');
				catTitle.classList.add('cat-title');
				const catText = document.createElement('div');
				catText.classList.add('cat-text');

				catImage.style.background = `url(https://cataas.com/cat/${catData[i].id}) 30% 40%`;
				catTitle.innerText = `Cat #${i + 1}`
				catText.innerHTML = `Tags: <br>${catData[i].tags}`

				newCat.appendChild(catImage); 
				newCat.appendChild(catTitle); 
				newCat.appendChild(catText);
				catsGrid.appendChild(newCat);
			}
		})
	
		.catch(error => console.error(error))
}












function fillCatsGrid() {
	getCats()
	.then((data) => {
			for(let i = 0; i < maxCats; i++) {
				// console.log(data[i])

				const newCat = document.createElement('div');
				newCat.classList.add('cat-item');

				const catImage = document.createElement('div');
				catImage.classList.add('cat-image');
				const catTitle = document.createElement('div');
				catTitle.classList.add('cat-title');
				const catText = document.createElement('div');
				catText.classList.add('cat-text');


				catImage.style.background = `url(https://cataas.com/cat/${data[i].id}) 30% 40%`;
				catTitle.innerText = `Cat #${i + 1}`
				catText.innerHTML = `Tags: <br>${data[i].tags}`

				newCat.appendChild(catImage); 
				newCat.appendChild(catTitle); 
				newCat.appendChild(catText);
				catsGrid.appendChild(newCat);
			}
			// console.log(data)
		}
	)
	.catch(error => console.error(error))
}

// console.log('Test log')