'use strict';

const shelf = document.querySelector('#shelf');
const showcase = document.querySelector('#showcase');
const greeting = document.querySelector('#greeting');
const up = document.querySelector('#up');
const back = document.querySelector('#back');
const rdg = document.querySelector('#rdg');
const wtr = document.querySelector('#wtr');
const finished = document.querySelector('#finished');
const favourites = document.querySelector('#favourites');
const exit = document.querySelector('#exit');
let entry, objBook, objUserShelves;

if ('serviceWorker'in navigator) {
	window.addEventListener('load', ()=>{
		navigator.serviceWorker.register('/service-worker.js').then(registration=>{
			console.log('The service worker has registered with scope: ', registration.scope);
		}
		).catch(error=>{
			console.log('The service worker registration has failed: ', error);
		}
		);
	}
	);
}

window.addEventListener('scroll', showButton);
up.addEventListener('click', scrollUp);

// Displays the Top button when the user scrolls more than 100px
function showButton() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		up.style.display = "block";
	} else {
		up.style.display = "none";
	}
}

// When the user clicks on the button, scroll to the top of the document
function scrollUp() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function getShowcase(book) {
	showcase.textContent = "";
	shelf.textContent = "";
	greeting.textContent = "Choose a book to learn more";
	for (entry of book) {
		displayCovers(entry);
	}
}

function getBookList(book) {
	for (entry of book) {
		displayRow(entry);
	}
}

function getBookDetails(alt) {
	showcase.textContent = "";
	shelf.textContent = "";
	for (entry of allBooks) {
		if (entry.title == alt) {
			displayRow(entry);
		}
	}
}

function displayRow(book) {
	let row = document.createElement('tr');
	let data = document.createElement('td');
	let img = document.createElement('img');
	img.setAttribute('src', `images/covers/${book.cover}`);
	img.setAttribute('width', '300');
	img.setAttribute('height', '463');
	img.setAttribute('alt', book.title);
	data.innerHTML = "Title: " + book.title + "<br>Author: " + book.author + "<br>Year Published: " + book.year + "<br>Pages: " + book.pages + "<br>Genre: " + book.genre + "<br>Publisher: " + book.publisher + "<br>Synopsis: " + book.synopsis;
	row.appendChild(img);
	row.appendChild(data);
	shelf.appendChild(row);
}

function displayCovers(book) {
	let img = document.createElement('img');
	img.setAttribute('src', `images/covers/${book.cover}`);
	img.setAttribute('width', '300');
	img.setAttribute('height', '463');
	img.setAttribute('alt', book.title);
	img.setAttribute('isbn', book.isbn);
	showcase.append(img);
}

function getUserShelves(userID, condition) {
	objUserShelves = allShelves.filter(list=>list.id.substring(0, 3) == userID);
	for (entry of objUserShelves) {
		if (entry.state == condition) {
			objBook = find(list=>list.isbn == entry.id.substring(3, 13));
			displayRow(objBook);
		}
	}
}

function getUserFavorites(userID) {
	objUserShelves = allShelves.filter(list=>list.id.substring(0, 3) == userID);
	for (entry of objUserShelves) {
		if (entry.favourite == "yes") {
			objBook = find(list=>list.isbn == entry.id.substring(3, 13));
			displayRow(objBook);
		}
	}
}

function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		 if (rawFile.readyState === 4 && rawFile.status == "200") {
			  callback(rawFile.responseText);
		 }
	}
	rawFile.send(null);
}