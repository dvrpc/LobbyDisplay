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

	// for the Current Month page
	thisMonthTitle.innerHTML = month
	
	const date = new Date()
	const month = months[date.getMonth() + 1] 
	const year = date.getFullYear()

	// output is Thu Dec 07 2017
	const today = date.toDateString()

	const firstOfMonth = new Date(`${month}-${year}-01`)

	// output is Fri Dec 01 2017 and a time string
	console.log('first of month for december is ', firstOfMonth)
	
	// using first of the month, number each square in the calendar according to their date
	// in order to make this calendar, I might have to re-write my CSS grid to be 5 columns, each one consisting
	// of 5 rows instead of the current 5 x 5 set up I have now. That way, I can 

	// loop through each event object and place them accordingly 
	data.events.forEach((event, index) => {
	})
}

getData()