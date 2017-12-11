const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// get a hold of the Upcoming Events information 
const upcoming = document.querySelector('#upcoming-events')
const calendarBoxes = document.querySelectorAll('.this-month')
const nextMonthCalendarBoxes = document.querySelectorAll('.next-month')
let thisMonthTitle = document.getElementById('current-month-name')
const nextMonthTitle = document.getElementById('next-month-name')

const getData = async () => {
	const date = new Date()
	let dayNum = 1

	/***** set up to create THIS months calendar *****/
	const today = date.toDateString().split(' ')[2]
	let thisMonth = date.getMonth() + 1
	const thisMonthString = months[thisMonth] 
	const year = date.getFullYear()
	const endOfMonth = new Date(year, thisMonth, 0).toDateString().split(' ')[2]
	
	const timemin = `${year}-${thisMonth}-01`
	const timemax = `${year}-${thisMonth}-${endOfMonth}`

	let dayCounter = new Date(`${thisMonthString}-${year}-01`).getDay()
	let dayTracker = dayCounter - 1

	const thisMonthStream = await fetch(`https://www.dvrpc.org/asp/homepage/getCalendarItems.aspx?timemin=${timemin}&timemax=${timemax}`)
	const events = await thisMonthStream.json()

	/***** set up to create NEXT months calendar *****/
	const nextMonth = date.getMonth() === 11 ? 01 : date.getMonth() + 2
	const nextMonthString = months[nextMonth] 
	let nextMonthYear = thisMonth === 12 ? date.getFullYear() + 1 : date.getFullYear()
	const endOfNextMonth = new Date(nextMonthYear, nextMonth, 0).toDateString().split(' ')[2]
	
	const timeminNext = `${nextMonthYear}-${nextMonth}-01`
	const timemaxNext = `${nextMonthYear}-${nextMonth}-${endOfNextMonth}`

	let nextMonthDayCounter = new Date(`${nextMonthString}-${nextMonthYear}-01`).getDay()
	let nextMonthDayTracker = nextMonthDayCounter - 1

	const nextMonthStream = await fetch(`https://www.dvrpc.org/asp/homepage/getCalendarItems.aspx?timemin=${timeminNext}&timemax=${timemaxNext}`)
	const nextMonthEvents = await nextMonthStream.json()


	/***** Upcoming events page *****/
	let eventsCounter = 0
	events.forEach((event, index) => {
		const rawDate = event.StartDate.split('-')
		const date = `${months[rawDate[1]]} ${rawDate[2]}`
		
		// don't include events that have already happened
		if(rawDate[2] < today) return

		eventsCounter ++
		// no more than 5 items displayed at a time
		if(eventsCounter > 5) return

		const title = document.createElement('h2')
		title.innerHTML = event.Title

		const timing = event.StartTime ? `${event.StartTime} - ${event.EndTime}  |  ` : ''
		const content = document.createElement('p')
		content.innerHTML = `${timing}  ${date}`

		const hr = document.createElement('hr')

		upcoming.appendChild(title)
		upcoming.appendChild(content)

		// don't add an hr to the last event
		if(eventsCounter < 5) upcoming.appendChild(hr)
	})
	

	/***** Dynamically build BOTH calendars *****/
	thisMonthTitle.innerHTML = thisMonthString
	nextMonthTitle.innerHTML = nextMonthString
	calendarBoxes[today].classList.add('today')

	for(var i = 1; i < 32; i++){

		// populate this months calendar with dates and events
		if(0 < dayCounter && dayCounter < 6){
			calendarBoxes[dayTracker].classList.add('in-month')
			const dayNumP = document.createElement('p')
			dayNumP.classList.add('day-number')
			dayNumP.innerHTML = dayNum
			calendarBoxes[dayTracker].appendChild(dayNumP)
			const eventDate = events.length ? parseInt(events[0].StartDate.split('-')[2]) : 99

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

		// populate next months calendar with dates and events
		if(0 < nextMonthDayCounter && nextMonthDayCounter < 6){
			nextMonthCalendarBoxes[nextMonthDayTracker].classList.add('in-month')
			const dayNumP = document.createElement('p')
			dayNumP.classList.add('day-number')
			dayNumP.innerHTML = dayNum
			nextMonthCalendarBoxes[nextMonthDayTracker].appendChild(dayNumP)
			const eventDate = nextMonthEvents.length ? parseInt(nextMonthEvents[0].StartDate.split('-')[2]) : 99

			// check for an event on this day
			if(eventDate === dayNum){
				const dayEvent = document.createElement('h2')
				dayEvent.classList.add('event-on-calendar')
				dayEvent.innerHTML = nextMonthEvents[0].Title
				nextMonthCalendarBoxes[nextMonthDayTracker].appendChild(dayEvent)
				nextMonthEvents.shift()
			}
			nextMonthDayTracker++
		}else if(nextMonthDayCounter === 7) nextMonthDayCounter = 0

		nextMonthDayCounter++
		dayCounter++ 	
		dayNum++
	}
}

// potentialy wrap this in a setInterval so that it calls once a day around 7 am or something
getData()