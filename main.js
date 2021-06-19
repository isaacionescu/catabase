// main site:                    https://cataas.com
// JSON collection of all cats:  https://cataas.com/api/cats
// JSON collection w/ filtering: https://cataas.com/api/cats?tags=cute
// example of an individual cat: https://cataas.com/cat/595f280e557291a9750ebf9f

const catsGrid = document.querySelector('.cats-grid');
const categoriesForm = document.querySelector('.categories-form');
const ul = document.querySelector('ul');
const apiUrl = 'https://cataas.com/api/cats';
const apiRandom = 'https://cataas.com/cat';
const maxCats = 8;

async function getCats() {
    let response = await fetch(apiUrl);
    let catsArray = await response.json();
    // let catsArrayStringified = JSON.stringify(catsArray)
    return catsArray;
};

function fillCategoriesForm() {
	getCats()
		.then((data) => {
			console.log(data.length)
			console.log(data[0])
			console.log(data)
			let myTagsArray = [];

			function createNewTagsArray() {
				// let value = 0;
				for (let i = 0; i <= maxCats; i++) {
					// value+= 1;
					// console.log(`It works ${value}`)
					data[i].tags.forEach(e => myTagsArray.push(e))
				}
				myTagsArray.sort()
				console.log(myTagsArray)
				createCheckboxesForEachTag()
			} createNewTagsArray()

			function createCheckboxesForEachTag() {
				myTagsArray.forEach(element => {

					const newCheckBox = document.createElement('input');
					newCheckBox.classList.add('tag-item')
					newCheckBox.type = "checkbox";
					newCheckBox.name = element;
					newCheckBox.id = element;
					console.log(newCheckBox)

					const newLabel = document.createElement('label');
					newLabel.for = element;
					newLabel.innerText = ` ${element}`;
					console.log(newLabel)

					const newLi = document.createElement('li');
					ul.appendChild(newLi);
					newLi.appendChild(newCheckBox);
					newLi.appendChild(newLabel)
				})
			}


		})

		.catch(error => console.error(error))

}

fillCategoriesForm()

function fillCatsGrid() {
	// setInterval(() => {
	for(let i = 0; i < maxCats; i++) {
		const newCat = document.createElement('div');
		newCat.classList.add('cat-item');

		const catImage = document.createElement('div');
		catImage.classList.add('cat-image');
		const catTitle = document.createElement('div');
		catTitle.classList.add('cat-title');
		const catText = document.createElement('div');
		catText.classList.add('cat-text');

		newCat.appendChild(catImage); 
		newCat.appendChild(catTitle); 
		newCat.appendChild(catText);

		getCats()
			.then((data) => { 
					catImage.style.background = `url(https://cataas.com/cat/${data[i].id}) 30% 40%`;
					catTitle.innerText = `Cat #${i + 1}`
					console.log(data[i].tags)
					catText.innerHTML = `Tags: <br>${data[i].tags}`
					// const obj = JSON.parse(data)
					// const res = [];
					// for(let i in obj) {
					// 	res.push(obj[i])
					// }
					// console.log(obj)
					// console.log(res)
				}
			)
			.catch(error => console.error(error))
		catsGrid.appendChild(newCat);
	}
	// }, 1000)
}

fillCatsGrid()	




// function createCatSubcategories() {
// 	return `
// 		<div class="cat-picture"></div>
// 		<div class="cat-title"></div>
// 		<div class="cat-description"></div>
// 	`
// }

console.log('Test log')