'use strict'
// get a hold of the Upcoming Events information 
const months = ['fake index month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let upcomingTitles = document.querySelectorAll('section.upcoming-content-box > h2')
let upcomingDescriptions = document.querySelectorAll('section.upcoming-content-box > p')

// async await for that ishhh
const getData = async () => {
	const stream = await fetch('https://www.dvrpc.org/asp/homepage/default.aspx')
	const data = await stream.json()

	upcomingTitles.forEach((title, index) => title.innerHTML = data.events[index].Title)
	upcomingDescriptions.forEach((content, index) => {
		const rawDate = data.events[index].StartDate.split('-')
		const date = `${months[rawDate[1]]} ${rawDate[2]}`
		const timing = data.events[index].StartTime ? `${data.events[index].StartTime} - ${data.events[index].EndTime}  |  ` : ''
		content.innerHTML = `${timing} ${date}`
	})
}

getData()