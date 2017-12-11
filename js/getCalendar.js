const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// get a hold of the Upcoming Events information 
let upcomingTitles = document.querySelectorAll('section.upcoming-content-box > h2')
let upcomingDescriptions = document.querySelectorAll('section.upcoming-content-box > p')
const calendarBoxes = document.querySelectorAll('.this-month')
const nextMonthCalendarBoxes = document.querySelectorAll('.next-month')
let thisMonthTitle = document.getElementById('current-month-name')
const nextMonthTitle = document.getElementById('next-month-name')

const getData = async () => {

	// get date info to construct timemin and timemax for this month
	const date = new Date()
	let thisMonth = date.getMonth() + 1
	const thisMonthString = months[thisMonth] 
	const year = date.getFullYear()
	const endOfMonth = new Date(year, thisMonth, 0).toDateString().split(' ')[2]
	
	const timemin = `${year}-${thisMonth}-01`
	const timemax = `${year}-${thisMonth}-${endOfMonth}`

	// get date info to dynamically construct the calendar
	let dayCounter = new Date(`${thisMonthString}-${year}-01`).getDay()
	const today = date.toDateString().split(' ')[2]
	let dayNum = 1
	let dayTracker = dayCounter - 1

	const thisMonthStream = await fetch(`https://www.dvrpc.org/asp/homepage/getCalendarItems.aspx?timemin=${timemin}&timemax=${timemax}`)
	const events = await thisMonthStream.json()

	// construct all the stuff for NEXT month
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

	/**** upcoming events page ****/
	upcomingTitles.forEach((title, index) => title.innerHTML = events[index].Title)
	upcomingDescriptions.forEach((content, index) => {
		const rawDate = events[index].StartDate.split('-')
		const date = `${months[rawDate[1]]} ${rawDate[2]}`
		const timing = events[index].StartTime ? `${events[index].StartTime} - ${events[index].EndTime}  |  ` : ''
		content.innerHTML = `${timing} ${date}`
	})
	// ^ could refactor all the above into a single loop by looping through events and creating elements dynamically
		// e.g. events.forEach(event => createH1 with title, createH2 with name, create time with StartTime, etc., etc.,)
		// re-visit this once the nextMonth calendar is created
		// must do b/c not every month has 5 events 
	
	/**** Dynamically build both calendars ****/

	thisMonthTitle.innerHTML = thisMonthString
	nextMonthTitle.innerHTML = nextMonthString
	calendarBoxes[today].classList.add('today')

	for(var i = 1; i < 31; i++){
		// check for valid days: if (0 < i < 6)
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

		// make next months calendar
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

getData()