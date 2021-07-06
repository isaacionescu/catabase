// main site:                    https://cataas.com
// JSON collection of all cats:  https://cataas.com/api/cats
// JSON collection w/ filtering: https://cataas.com/api/cats?tags=cute
// example of an individual cat: https://cataas.com/cat/595f280e557291a9750ebf9f

const body = document.querySelector('body');
const catsGrid = document.querySelector('.cats-grid');
const categoriesForm = document.querySelector('.categories-form');
const ul = document.querySelector('ul');
const apiUrl = 'https://cataas.com/api/cats';
const apiRandom = 'https://cataas.com/cat';

let dynamicTagsArray = [];
let fullCatData = [];
const maxCats = 5
/*console.log(`allRawCatData:`)
console.log(allRawCatData)*/


async function getCats() {
    let response = await fetch(apiUrl);
    let catsArray = await response.json();
    return catsArray;
};

function fillCategoriesForm() {
	getCats()
		.then((rawCatData) => {
			let myTagsArray = [];
			fullCatData = rawCatData;
			// console.log(`allRawCatData below:`)
			// console.log(fullCatData)

			function createNewTagsArray() {
				for (let i = 0; i <= maxCats; i++) {
					rawCatData[i].tags.forEach(element => myTagsArray.push(element))
				}
				myTagsArray = cleanUpAndSort(myTagsArray);
				createCheckboxesForEachTag()
			}
			createNewTagsArray()

			function cleanUpAndSort(data) {
				data = data.filter((value, index) => data.indexOf(value) === index);
				data = data.sort();
				return data;
			}

			function createCheckboxesForEachTag() {
				myTagsArray.forEach(element => {
					const newCheckBox = document.createElement('input');
					// newCheckBox.innerHTML = `class="tag-item" type="checkbox" name="${element}" id="${element}"`
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
		})
		.catch(error => console.error(error))
}
fillCategoriesForm()


function filterResultsByTag() {
	document.addEventListener('click', event => {
		let tag = event.target.id;
		if(event.target.matches('.tag-item')) {
			if (event.target.checked) {
				console.log(`✅ Selected: ${tag}`)
				dynamicTagsArray.push(tag)
				preFilter(tag)
			}
			else if (!event.target.checked) {
				console.log(`❌ Deselected: ${tag}`)
				dynamicTagsArray = dynamicTagsArray.filter(element => (element != tag));
				filterRemove(tag)
			}
		console.log(`// Current dynamicTagsArray: [${dynamicTagsArray}]`)
		}
	})
}

function filterRemove(tag) {
	let allCatsOnDOM = document.getElementsByClassName(tag);
	if(allCatsOnDOM.length > 0) {
		console.log(allCatsOnDOM.length)
		for (let i = 0; i < allCatsOnDOM.length; i++) {
			const individualCat = document.querySelector(`.${tag}`)
			individualCat.parentNode.removeChild(individualCat)
		}
	}
}


function preFilter(tagID) {
	dynamicTagsArray.forEach(myTag => {
		for(let i = 0; i < dynamicTagsArray.length; i++) {
			fullCatData[i].tags.forEach(element => {
				// console.log(tagID)
				if(myTag === element) {
					console.log(`MATCH!`)
					filterAdd(fullCatData[i])
				}
			})
		}
	}) 
}


function filterAdd(catItem) {
	// console.log(catItem)
	getCats()
		.then((data) => {
			let newCat = document.createElement('div');
			newCat.classList.add('cat-item');
			newCat.id = `abc-${catItem.id}`;

			catItem.tags.forEach(tag => {
				newCat.classList.add(`${tag}`)
			})
			console.log(newCat.classList)

			const catImage = document.createElement('div');
			catImage.classList.add('cat-image');
			const catTitle = document.createElement('div');
			catTitle.classList.add('cat-title');
			const catText = document.createElement('div');
			catText.classList.add('cat-text');

			catImage.style.background = `url(https://cataas.com/cat/${catItem.id}) 30% 40%`;
			// catTitle.innerText = `Cat #${i + 1}`
			catText.innerHTML = `Tags: <br>${catItem.tags}`

			newCat.appendChild(catImage); 
			newCat.appendChild(catTitle); 
			newCat.appendChild(catText);
			catsGrid.appendChild(newCat);
		}
	)
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

// fillCatsGrid()

// console.log('Test log')