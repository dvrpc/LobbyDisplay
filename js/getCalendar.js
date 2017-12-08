'use strict'
const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']

// get a hold of the Upcoming Events information 
let upcomingTitles = document.querySelectorAll('section.upcoming-content-box > h2')
let upcomingDescriptions = document.querySelectorAll('section.upcoming-content-box > p')
let thisMonthTitle = document.getElementById('current-month-name')

// async await for that ishhh
const getData = async () => {
	const stream = await fetch('https://www.dvrpc.org/asp/homepage/default.aspx')
	const data = await stream.json()
	// with the JSON the only way to get the month is to pull it from the 1st event
	// output = [year, month, day]

	// for the Upcoming Events Page
	upcomingTitles.forEach((title, index) => title.innerHTML = data.events[index].Title)
	upcomingDescriptions.forEach((content, index) => {
		const rawDate = data.events[index].StartDate.split('-')
		const date = `${months[rawDate[1]]} ${rawDate[2]}`
		const timing = data.events[index].StartTime ? `${data.events[index].StartTime} - ${data.events[index].EndTime}  |  ` : ''
		content.innerHTML = `${timing} ${date}`
	})
	
	const date = new Date()
	const month = months[date.getMonth() + 1] 
	const year = date.getFullYear()

	// output is a number corresponding to todays date, e.g. 08
	const today = date.toDateString().split(' ')[2]

	// for the Current Month page
	thisMonthTitle.innerHTML = month

	// output is a number 1-7 corresponding to mon-fri
	const firstOfMonth = new Date(`${month}-${year}-01`).getDay()
	
	let calendarBoxes = document.querySelectorAll('.thisMonthBox')
	console.log('calendarBoxes ', calendarBoxes)
	calendarBoxes.forEach((day, index) => {

	})

	for(var i = firstOfMonth - 1; i < 25 - firstOfMonth; i++){
		calendarBoxes[i].classList.add('inMonth')
	}


	// loop through each event object and place them accordingly 
	data.events.forEach((event, index) => {
	})
}

getData()