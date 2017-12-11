const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// get a hold of the Upcoming Events information 
let upcomingTitles = document.querySelectorAll('section.upcoming-content-box > h2')
let upcomingDescriptions = document.querySelectorAll('section.upcoming-content-box > p')
let thisMonthTitle = document.getElementById('current-month-name')

const getData = async () => {

	// get the data from the JSON file
	const stream = await fetch('https://www.dvrpc.org/asp/homepage/default.aspx')
	const data = await stream.json()
	const events = data.events

	// variables for this months calendar
	const date = new Date()
	const thisMonth = months[date.getMonth() + 1] 
	const year = date.getFullYear()
	let dayCounter = new Date(`${thisMonth}-${year}-01`).getDay()
	const calendarBoxes = document.querySelectorAll('.this-month-box')
	const today = date.toDateString().split(' ')[2]
	let dayNum = 1
	let dayTracker = dayCounter - 1

	/* upcoming events page */
	upcomingTitles.forEach((title, index) => title.innerHTML = events[index].Title)
	upcomingDescriptions.forEach((content, index) => {
		const rawDate = events[index].StartDate.split('-')
		const date = `${months[rawDate[1]]} ${rawDate[2]}`
		const timing = events[index].StartTime ? `${events[index].StartTime} - ${events[index].EndTime}  |  ` : ''
		content.innerHTML = `${timing} ${date}`
	})
	
	/* Current Month page */
	thisMonthTitle.innerHTML = thisMonth
	calendarBoxes[today].classList.add('today')

	// this loop is gross but it works. needs cleaning up ASAP 
	for(var i = 1; i < 31; i++){

		// check for valid days: if (0 < i < 6)
		if(0 < dayCounter && dayCounter < 6){
			calendarBoxes[dayTracker].classList.add('in-month')
			const dayNumP = document.createElement('p')
			dayNumP.classList.add('day-number')
			dayNumP.innerHTML = dayNum
			calendarBoxes[dayTracker].appendChild(dayNumP)
			const eventDate = parseInt(events[0].StartDate.split('-')[2])

			// check for an event on this day
			if(eventDate === dayNum){
				const dayEvent = document.createElement('h2')
				dayEvent.classList.add('event-on-calendar')
				dayEvent.innerHTML = events[0].Title
				calendarBoxes[dayTracker].appendChild(dayEvent)
				events.shift()
			}
			dayTracker++
		}else if(dayCounter === 7) dayCounter = 0

		dayCounter++ 	
		dayNum++
	}
}

getData()