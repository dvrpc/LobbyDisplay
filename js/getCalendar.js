'use strict'
// get a hold of the Upcoming Events information 
let upcomingTitles = document.querySelectorAll('section.upcoming-content-box > h2')
let upcomingDescriptions = document.querySelectorAll('section.upcoming-content-box > p')

console.log('upcoming titles ', upcomingTitles)
console.log('upcoming descriptions ', upcomingDescriptions)

// async await for that ishhh
const getData = async () => {
	const stream = await fetch('https://www.dvrpc.org/asp/homepage/default.aspx')
	const data = await stream.json()
	/* relevant output fields in data:
		1) data.events.StartDate gives the DATE of the event
		2) data.events.Title gives the NAME of the event 
	*/
	console.log('fetched data is ', data)
	upcomingTitles.forEach((title, index) => title.innerHTML = data.events[index].Title)

}

getData()