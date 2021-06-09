// main site: https://cataas.com
// filtering: https://cataas.com/api/cats?tags=cute
// example:   https://cataas.com/cat/595f280e557291a9750ebf9f

const apiUrl = 'https://cataas.com/api/cats';
const apiRandom = 'https://cataas.com/cat';
const catsGrid = document.querySelector('.cats-grid');
const maxCats = 8;


function fillCatsGrid() {

// setInterval(() => {
	for(let i = 0; i < maxCats; i++) {
		const newCat = document.createElement('div');
		newCat.classList.add('cat-item')

		const catImage = document.createElement('div');
			catImage.classList.add('cat-image');
		const catTitle = document.createElement('div');
			catTitle.classList.add('cat-title');
		const catDescription = document.createElement('div');
			catDescription.classList.add('cat-description');

		newCat.appendChild(catImage);
		newCat.appendChild(catTitle);
		newCat.appendChild(catDescription);

		getCats()
			.then(
				function assigning(data) { 
					// catImage.style.background = `url('https://cataas.com/cat/${data[i]}') 30% 40%`;
					catImage.style.background = `url(${apiRandom}) 30% 40%`;
					console.log(data)
				}
			)
			.catch(error => console.error(error))
		catsGrid.appendChild(newCat);
	}
// }, 2000)

}

fillCatsGrid()


async function getCats() {
    let response = await fetch(apiUrl);
    let catsArray = await response.json();
    let catsArrayStringified = JSON.stringify(catsArray[0])
    return catsArrayStringified;
};


// function createCatSubcategories() {
// 	return `
// 		<div class="cat-picture"></div>
// 		<div class="cat-title"></div>
// 		<div class="cat-description"></div>
// 	`
// }

console.log('Test log')