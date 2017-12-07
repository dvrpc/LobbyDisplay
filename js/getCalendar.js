'use strict'
// get a hold of the Upcoming Events information 
let upcoming = document.querySelector

// async await for that ishhh
const getData = async () => {
	const stream = await fetch('https://www.dvrpc.org/asp/homepage/default.aspx')
	const data = await stream.json()
	/* relevant output fields in data:
		1) data.events.StartDate gives the DATE of the event
		2) data.events.Title gives the NAME of the event 
	*/
	console.log('fetched data is ', data)
	const 
}

getData()