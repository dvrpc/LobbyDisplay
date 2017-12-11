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

	// for the Current Month page
	thisMonthTitle.innerHTML = month

	// output is a number 0-6 corresponding to mon-fri
	const firstOfMonth = new Date(`${month}-${year}-01`).getDay()

	let calendarBoxes = document.querySelectorAll('.thisMonthBox')

	// output is a number corresponding to todays date, e.g. 08
	const today = date.toDateString().split(' ')[2]
	calendarBoxes[today].classList.add('today')

	// calendar date maker
	let dayNum = 1
	// 0-6 days of the week counter
	let norf = firstOfMonth
	// tracker for dates and shit
	let borf = firstOfMonth - 1
	// for friday, i = 4
	// this loop is gross but it works. needs cleaning up ASAP 
	for(var i = firstOfMonth - 1; i < 31 + firstOfMonth - 1; i++){
		/* for valid days do the following:
			1) add the inMonth class
			2) add the day of the week
			3) IF an event exists on that day, add it
		*/

		// check for valid days: if (0 < i < 6)
		if(0 < norf && norf < 6){
			calendarBoxes[borf].classList.add('inMonth')
			const dayNumP = document.createElement('p')
			dayNumP.innerHTML = dayNum
			calendarBoxes[borf].appendChild(dayNumP)
			const eventDate = parseInt(data.events[0].StartDate.split('-')[2])
			console.log('event date ', eventDate)
			console.log('dayNum ', dayNum)
			// check for an event on this day
			if(eventDate === dayNum){
				console.log('events if statement')
				const dayEvent = document.createElement('h2')
				dayEvent.innerHTML = data.events[0].Title
				calendarBoxes[borf].appendChild(dayEvent)
				data.events.shift()
			}
			borf++
		}else if(norf === 7) norf = 0

		norf++ 	
		dayNum++
	}
}

getData()