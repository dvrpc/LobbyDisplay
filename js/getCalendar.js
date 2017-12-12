const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// get a hold of the Upcoming Events information 
const upcomingEvents = document.querySelector('#upcoming-events')
const calendarBoxes = document.querySelectorAll('.this-month')
const nextMonthCalendarBoxes = document.querySelectorAll('.next-month')
let thisMonthTitle = document.getElementById('current-month-name')
const nextMonthTitle = document.getElementById('next-month-name')

const makeCalendar = (dayCounter, dayTracker, calendarBoxes, events) => {
	let dayNum = 1
	for(var i = 1; i < 32; i++){

		// populate the months calendar with dates and events
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

		dayCounter++
		dayNum++
	}
}

const getData = async () => {
	const date = new Date()

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


	/***** Dynamically build the upcoming events page, limited to 5 events from either this month or next month *****/
	let eventsHolder = Object.assign([], events)
	let nextMonthsEventsHolder = Object.assign([], nextMonthEvents)
	const notEnoughEvents = {StartDate: '', Title: '', StartTime: '', EndTime: ''}

	for(var i = 0; i < 5; i++){

		// figure out if the event is coming from this month or next month then grab it and shift the array it came from
		// edge case where there aren't 5 events between the two months, use the empty object
		const thisEvent = eventsHolder.length ? eventsHolder.shift() : nextMonthsEventsHolder.length ? nextMonthsEventsHolder.shift() : notEnoughEvents
		
		const rawDate = thisEvent.StartDate.split('-')
		const eventDate = new Date(rawDate[0], rawDate[1], rawDate[2])
		const todaysDate = new Date(year, thisMonth, today)

		// compare event date to today and skip any events that have already passed
		if(eventDate < todaysDate) {
			i--
			continue
		}

		const date = `${months[parseInt(rawDate[1])]} ${rawDate[2]}`
		const title = document.createElement('h2')
		const timing = thisEvent.StartTime ? `${thisEvent.StartTime} - ${thisEvent.EndTime}  |  ` : ''
		const content = document.createElement('p')
		title.innerHTML = thisEvent.Title
		content.innerHTML = `${timing}  ${date}`

		upcomingEvents.appendChild(title)
		upcomingEvents.appendChild(content)
		if(i < 4 ){
			const hr = document.createElement('hr')
			upcomingEvents.appendChild(hr)
		}
	}
	

	/***** Dynamically build BOTH calendars *****/
	thisMonthTitle.innerHTML = thisMonthString
	nextMonthTitle.innerHTML = nextMonthString
	calendarBoxes[today].classList.add('today')
	makeCalendar(dayCounter, dayTracker, calendarBoxes, events)
	makeCalendar(nextMonthDayCounter, nextMonthDayTracker, nextMonthCalendarBoxes, nextMonthEvents)
}

// potentialy wrap this in a setInterval so that it calls once a day around 7 am or something
getData()