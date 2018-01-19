const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const upcomingEvents = document.querySelector('#upcoming-events')
const calendarBoxes = document.querySelectorAll('.this-month')
const nextMonthCalendarBoxes = document.querySelectorAll('.next-month')
let thisMonthTitle = document.getElementById('current-month-name')
const nextMonthTitle = document.getElementById('next-month-name')
const announcementsSection = document.querySelector('#announcements')
const productsSection = document.querySelector('#new-products')

const convertToAMPM = timeString => {
	if(!timeString) return ''
	let hours = +timeString.substr(0, 2)
	const hoursFormatted = (hours % 12) || 12
	let amORpm = hours < 12 ? ' am' : ' pm'
	const formattedTime = hoursFormatted + timeString.substr(2, 3) + amORpm
	return formattedTime
}

const populateUpcomingEvents = (thisMonthsEvents, nextMonthsEvents, year, thisMonth, today) => {
	const notEnoughEvents = {StartDate: '', Title: '', StartTime: '', EndTime: ''}
	for(var i = 0; i < 5; i++){

		// figure out if the event is coming from this month or next month then grab it and shift the array it came from
		// edge case where there aren't 5 events between the two months, use the empty object
		const thisEvent = thisMonthsEvents.length ? thisMonthsEvents.shift() : nextMonthsEvents.length ? nextMonthsEvents.shift() : notEnoughEvents
		const rawDate = thisEvent.StartDate.split('-')
		const eventDate = new Date(rawDate[0], rawDate[1], rawDate[2])
		const todaysDate = new Date(year, thisMonth, today)

		// compare event date to today and skip any events that have already passed
		if(eventDate < todaysDate) {
			i--
			continue
		}

		if(rawDate[2][0] === '0') rawDate[2] = rawDate[2][1]
		const date = `${months[parseInt(rawDate[1])]} ${rawDate[2]}`
		const start = convertToAMPM(thisEvent.StartTime)
		const end = convertToAMPM(thisEvent.EndTime)
		const timing = start || end ? `${start} - ${end} | ` : '' 
		
		const title = document.createElement('h2')
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
}

const makeCalendar = (dayCounter, dayTracker, calendarBoxes, events, thisMonth) => {
	let dayNum = 1
	const today = new Date().getDate()
	for(var i = 1; i < 32; i++){

		// populate the months calendar with dates and events
		if(0 < dayCounter && dayCounter < 6){
			if(thisMonth && dayNum === today) calendarBoxes[dayTracker].classList.add('today')
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

const populateAnnouncementsAndNewProducts = homepage => {

	console.log('homepage is ', homepage)

	for(var i = 0; i < 3; i++){
		// Create the Announcements page
		const announcementsTitle = document.createElement('h2')
		const announcementsContent = document.createElement('p')
		announcementsTitle.innerHTML = homepage.anns[i].title
		announcementsContent.innerHTML = homepage.anns[i].description

		announcementsSection.appendChild(announcementsTitle)
		announcementsSection.appendChild(announcementsContent)

		// Create the new products page
		const productsWrapper = document.createElement('div')
		const vert = document.createElement('div')
		vert.classList.add('productsVert')
		productsWrapper.classList.add('products-wrapper')
		const newProductsImg = document.createElement('img')
		const newProductsTitle = document.createElement('h2')
		const newProductsContent = document.createElement('p')
		let abstract = homepage.pubs[i].Abstract

		// break up into component words, cut off excess and append '...'
		// edit this truncation jawn if necessary 
		if(abstract.length > 150){
			let nthZero = abstract.indexOf(' ', 150)
			var truncatedAbstract = abstract.substring(0, nthZero) + ' ...'
		}

		newProductsImg.src = `https://www.dvrpc.org/asp/pubs/100px/${homepage.pubs[i].PubId}.png`
		newProductsImg.alt = `${homepage.pubs[i].Title} image`
		newProductsImg.classList.add('new-products-img')
		newProductsTitle.innerHTML = homepage.pubs[i].Title
		newProductsContent.innerHTML = truncatedAbstract || abstract

		productsWrapper.appendChild(newProductsImg)
		vert.appendChild(newProductsTitle)
		vert.appendChild(newProductsContent)
		productsWrapper.appendChild(vert)
		productsSection.appendChild(productsWrapper)

		if(i < 2){
			const hr = document.createElement('hr')
			const hr2 = document.createElement('hr')
			announcementsSection.appendChild(hr)
			productsSection.appendChild(hr2)
		}
	}
}

const getData = (async () => {
	const date = new Date()

	/***** set up to create THIS months calendar *****/
	const today = date.getDate()
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


	/***** set up to create the Announcements page *****/
	const homepageStream = await fetch('https://www.dvrpc.org/asp/homepage')
	const homepage = await homepageStream.json()


	/***** Dynamically build the upcoming events page, limited to 5 events from either this month or next month *****/
	let eventsHolder = Object.assign([], events)
	let nextMonthsEventsHolder = Object.assign([], nextMonthEvents)
	populateUpcomingEvents(eventsHolder, nextMonthsEventsHolder, year, thisMonth, today)


	/***** Dynamically build BOTH calendars *****/
	thisMonthTitle.innerHTML = thisMonthString
	nextMonthTitle.innerHTML = nextMonthString
	makeCalendar(dayCounter, dayTracker, calendarBoxes, events, true)
	makeCalendar(nextMonthDayCounter, nextMonthDayTracker, nextMonthCalendarBoxes, nextMonthEvents, false)


	/***** Dynamically build the Announcements & New Products pages *****/
	populateAnnouncementsAndNewProducts(homepage)


	// refresh the page & call the function every 12 hours
	setInterval(() => window.location.reload(true), 43200000)	
})()
	