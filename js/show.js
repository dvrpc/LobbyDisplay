'use strict'

// slideshow effect: setTimeout shifts the hidden class
// cycles through array of divs [homepage, upcoming, thisMonth, nextMonth, endpage] and moves the 'hidden' class from current to next after
// a set interval. This loop runs on an infinite loop

// get a hold of each div 
let homepage = document.querySelector('.homepage')
let upcoming = document.querySelector('.upcoming')
let this_month = document.querySelector('.this-month')
let next_month = document.querySelector('.next-month')
let endpage = document.querySelector('.endpage')

// make an array of the divs
const elements = [homepage, upcoming, this_month, next_month, endpage]

// add/remove the hidden class 
const updateView = arr => {
	// finds the current non-hidden element
	let currentView = document.querySelector('div:not(.hidden)')

	console.log('what is currentView ', currentView)
	// get index of currentView
	const index = arr.indexOf(currentView) // 0 for homepage, 4 for endpage

	// adds hidden to it
	currentView.classList.add('hidden')

	// check if current view is the last element & removes hidden from 1st element if true
	if(index === (arr.length - 1)){
		arr[0].classList.remove('hidden')
	}else{
		// removes hidden from the next element
		arr[index + 1].classList.remove('hidden')
	}
} 

// setInterval calls updateView every 10 seconds 
window.setInterval(updateView, 10000, elements)