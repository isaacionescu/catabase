// main site:                    https://cataas.com
// JSON collection of all cats:  https://cataas.com/api/cats
// JSON collection w/ filtering: https://cataas.com/api/cats?tags=cute
// example of an individual cat: https://cataas.com/cat/595f280e557291a9750ebf9f

const catsGrid = document.querySelector('.cats-grid');
const categoriesForm = document.querySelector('.categories-form');
const ul = document.querySelector('ul');
const apiUrl = 'https://cataas.com/api/cats';
const apiRandom = 'https://cataas.com/cat';

const maxCats = 3
let dynamicTagsArray = [];
let fullImportedRawCatData = [];
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
			fullImportedRawCatData = rawCatData;
			console.log(`allRawCatData:`)
			console.log(fullImportedRawCatData)

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
					newCheckBox.classList.add('tag-item')
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
					newLi.appendChild(newLabel)
				})

				fillCatsGrid()

				document.addEventListener('click', event => {
					filterResultsByTag()
				})
			}
		})
		.catch(error => console.error(error))
}
fillCategoriesForm()


function filterResultsByTag() {
		let tagID = event.target.id;
		if(event.target.matches('.tag-item')) {
			if (event.target.checked) {
				console.log(`// This was selected: ${tagID}`)
				dynamicTagsArray.push(tagID)
				console.log(`dynamicTagsArray: [${dynamicTagsArray}]`)
			}

			else if (!event.target.checked) {
				console.log(`/ This was deselected: ${tagID}`)
				dynamicTagsArray = dynamicTagsArray.filter(element => (element != tagID));
				console.log(`dynamicTagsArray: ${dynamicTagsArray}`)
			}
		}


		// fillCatsGrid()
}
//  


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

console.log('Test log')

// function createCatSubcategories() {
// 	return `
// 		<div class="cat-picture"></div>
// 		<div class="cat-title"></div>
// 		<div class="cat-description"></div>
// 	`
// }