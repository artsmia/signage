/**
 * @format
 */

var showSpecificImage = window.location.hash.replace('#', '')
var showLeftOrRightImage = showSpecificImage !== '' && showSpecificImage
var currentlyShowingSponsorImage = false
var currentlyShowingEventImage = false
// Show the `Third Thursday / Family Day` thank you message
// on all LOWER-LOBBY screens
// except the left of the two in the lower lobby screens
// (this is also used on the single screen in the Target lobby)

if (name == 'LOWER-LOBBY' || name === 'TARGET-ATRIUM') {
  var nextThirdThursday = nthDayOfMonth('Thursday', 3, date => {
    date.setHours(17)
    date.setMinutes(0)
    return date
  })
  var nextFamilyDay = nthDayOfMonth('Sunday', 2)
  //
  // For debugging
  // var nextToday = new Date().setHours(0, 0, 0, 0)

  // if it's between the start time of a sponsored event and 11pm that day,
  // we want to show the sponsor screen
  var sponsoredDays = [nextFamilyDay, nextThirdThursday]
  // var sponsoredDays = [nextFamilyDay, nextThirdThursday, nextToday] // DEBUG, see above
    .sort((d1, d2) => (d1 <= d2 ? -1 : 1))
    .filter(d => d >= new Date().setHours(0, 0, 0, 0))

  var pdFair = nthDayOfMonth('Friday', 1, date => {
    date.setHours(15)
    date.setMinutes(00)
    return date
  })
  var specialEvents = [
    new Date('2018-10-05T12:00:00.000Z'),
    new Date('2018-10-06T12:00:00.000Z'),
    new Date('2018-10-07T12:00:00.000Z'),
    // 2019 dates
    new Date('2019-10-04T12:00:00.000Z'),
    new Date('2019-10-05T12:00:00.000Z'),
    new Date('2019-10-06T12:00:00.000Z'),
  ]
    .sort((d1, d2) => d1 >= d2)
    .filter(d => d >= new Date().setHours(0, 0, 0, 0))

  var timeToChange, timeToChangeBack, timeToChangeEvent, timeToChangeEventBack

  if (sponsoredDays.length > 0) {
    timeToChange = sponsoredDays[0]
    timeToChangeBack = (d1 = new Date(timeToChange)).setHours(23) // 11pm that day
  }
  if (specialEvents.length > 0) {
    timeToChangeEvent = specialEvents[0]
    timeToChangeEventBack = (d1 = new Date(timeToChangeEvent)).setHours(23) // 11pm that day
    console.info('specialEvents!', { timeToChangeEvent, timeToChangeEventBack })
  }

  if (window.location.search.match('debug')) {
    // `?debug` will change 5s after loading and change back 9s after that
    timeToChange = Date.now() + 5000
    timeToChangeBack = timeToChange + 9000
  }
  if (window.location.search.match('event')) {
    // `?debug` will change 5s after loading and change back 9s after that
    timeToChangeEvent = Date.now() + 5000
    timeToChangeEventBack = timeToChangeEvent + 9000
  }
  var showEventImage = function() {
    reloadAtTime(timeToChangeEvent, function() {
      var day = new Date().getDay()
      var imageFile =
        day === 5
          ? '../exhibitions/pd-fair/PrintAndDrawingFair_LobbyScreenPricing_Friday.png'
          : '../exhibitions/pd-fair/PrintAndDrawingFair_LobbyScreenPricing_SaturdaySunday.png'
      console.info('showing Event image', { day, imageFile })
      image.src = imageFile
      currentlyShowingEventImage = true

      toggleCaption(false)
      reloadAtTime(timeToChangeEventBack, function() {
        console.info('leaving sponsor image')
        currentlyShowingEventImage = false
        toggleCaption(true)
        image.src = imageString.split(' ')[0]
        setTimeout(window.location.reload, 1000) // reload to set up for the next sponsored event
      })
    })
  }

  var showSponsorImage = function() {
    reloadAtTime(timeToChange, function() {
      var day = new Date().getDay()
      var imageFile = day === 4 ? './third-thursday.jpg' : './family.jpg'
      console.info('showing sponsor image for', day, imageFile)
      image.src = imageFile
      currentlyShowingSponsorImage = true
      toggleCaption(false)
      reloadAtTime(timeToChangeBack, function() {
        console.info('leaving sponsor image')
        currentlyShowingSponsorImage = false
        toggleCaption(true)
        image.src = imageString.split(' ')[0]
        setTimeout(window.location.reload, 1000) // reload to set up for the next sponsored event
      })
    })
  }

  // if (timeToChange) {
  if (timeToChange && showLeftOrRightImage !== 'right') {
    console.info(
      'will show sponsor image at ',
      new Date(timeToChange),
      'and back to the regularly scheduled programming at',
      new Date(timeToChangeBack),
      '(right now, it is)',
      new Date()
    )

    setTimeout(showSponsorImage, 0)
  }

  if (timeToChangeEvent && showLeftOrRightImage !== 'right') {
    console.info(
      'will show event image at ',
      new Date(timeToChangeEvent),
      'and back to the regularly scheduled programming at',
      new Date(timeToChangeEventBack),
      '(right now, it is)',
      new Date()
    )

    setTimeout(showEventImage, 0)
  }

  // Remove the sponsor signage screens from the otherwise listed images
  // that should show up - images for TT and family day only show on their
  // special days
  imageString = imageString
    .replace(' family.jpg', '')
    .replace(/\s?family.jpg\s?/, '')
    .replace(' third-thursday.jpg')
    .replace(/\s?third-thursday.jpg\s?/, '')
    .replace('s?LL-left-1.jpgs?', '')
    .replace('undefined', '')
    .trim()

  imageString = imageString
    .replace(/\s?(family|third-thursday|LL-left-1).jpg/, '')
    .trim()

  if (name == 'LOWER-LOBBY') {
    // Balance images on the left and right screens
    if (showLeftOrRightImage === 'left') {
      const filteredLeftImages = imageString
        .split(' ')
        .filter(img => img.match(/LL-left/))
        .join(' ')
      imageString = filteredLeftImages || imageString
    }

    if (showLeftOrRightImage !== 'left') {
      const filteredRightImages = imageString
        .split(' ')
        .filter(img => img.match(/LL-right/))
        .join(' ')
      imageString = filteredRightImages || imageString

      // don't caption the left screen
      toggleCaption(false)
    }
  } else if (name === 'TARGET-ATRIUM') {
  }
}

// If a sign for some reason doesn't have an image, fall back to branding™
if (typeof imageString === 'undefined' || !imageString || imageString === '')
  imageString = '../LOWER-LOBBY/LL-left-1.jpg'

var images = imageString
  .split(' ')
  .map(function(img) {
    return img
  })
  .filter(img => !!img)

var showIndexString =
  document.location.search.match(/\?(\d+)/) &&
  document.location.search.match(/\?(\d+)/)[1]
if (showIndexString && Number(showIndexString) !== NaN) {
  var showIndex = Number(showIndexString)
  images = images.slice(showIndex, showIndex + 1)
}

var image = document.createElement('img')

/* for LOWER-LOBBY, which has two screens showing the same sequence side-by-side,
 * offset the image shown by 1 so both screens don't always show the same thing.
 */
var jumpAheadToOffsetTwoScreens =
  name == 'LOWER-LOBBY' && showLeftOrRightImage === 'left'
var start = jumpAheadToOffsetTwoScreens ? 3%images.length : 0
image.src = './' + images[start]
console.info({jumpAheadToOffsetTwoScreens, start, src: image.src})

document.body.appendChild(image)

if (caption !== '' && showLeftOrRightImage !== 'right') {
  var text = document.createElement('div')
  text.classList.add('caption')
  var captionJson
  try {
    captionJson = JSON.parse(caption)
    fancyCaption()
  } catch (test) {
    captionJson = false
    text.innerHTML = caption
  }

  if (false && captionJson && Object.values(captionJson)[0].id) {
    // temporarily, don't caption artworks
    // (because the images have the gallery hardcoded
    // and re-making them all is hard. Continue to use the
    // location info to skip "Not on View" objects)
  } else {
    var gradient = document.createElement('div')
    gradient.classList.add('gradient-overlay')

    document.body.appendChild(text)
    document.body.appendChild(gradient)
    if (images[start].match(/noCaption/)) toggleCaption(false)
  }
}

var transition =
  images.length > 1 &&
  window.location.search !== '?debug' &&
  setInterval(function() {
    if (!currentlyShowingSponsorImage && !currentlyShowingEventImage) {
      var relativeImageName = image.src.match(/[^\/]+\.jpg$/)[0]
      var currentIndex = images.indexOf(relativeImageName)
      var nextIndex = (currentIndex + 1) % images.length

      if (captionJson) {
        var info = captionJson[images[nextIndex]]
        // skip to the next if:
        // an object is not on view per TMS
        // or an exhibition has ended per the calendar
        while (
          info.location == 'Not on View' ||
          (info.dateTo && new Date(info.dateTo) < new Date())
        ) {
          images.splice(nextIndex, 1)
          console.info('not on view or ended, skipping', info)
          nextIndex = (currentIndex + 1) % (images.length - 1)
          info = captionJson[images[nextIndex]]
        }
      }

      var nextImage = images[nextIndex]
      image.src = './' + nextImage
      if (captionJson) image.onload = fancyCaption

      // Don't caption certain images - those with `noCaption` in the filename
      if (nextImage.match(/noCaption/)) {
        toggleCaption(false)
      } else {
        toggleCaption(true)
      }
    }
  }, 11000)

/* utility functions
 */

function fancyCaption() {
  var relativeImageName = image.src.match(/[^\/]+\.jpg$/)[0]
  var info = captionJson[relativeImageName]

  if (info.id) {
    // Caption an artwork image based on ID
    text.innerHTML = `<h4>${info.location}</h4>`
  } else if (info.dateTo) {

    var startDate = new Date(info.dateFrom.replace(' ', 'T'))
    var endDate = new Date(info.dateTo.replace(' ', 'T'))
    var months = 'Jan Feb Mar Apr May June July Aug Sep Oct Nov Dec'.split(' ')
    var startMonth = months[startDate.getMonth()]
    var endMonth = months[endDate.getMonth()]

    // TODO de-dupe this
    var startsString = startMonth + ' ' + startDate.getDate()
    if (startDate.getFullYear() !== new Date().getFullYear())
      startsString += ' ' + startDate.getFullYear()
    var endsString = endMonth + ' ' + endDate.getDate()
    if (endDate.getFullYear() !== new Date().getFullYear())
      endsString += ' ' + endDate.getFullYear()

    var isUpcoming = startDate > new Date()
    const dateString = isUpcoming ? `${startsString} - ${endsString}` : `Closes ${endsString}`

    text.innerHTML = `<h1>${info.title}</h1> <h2>${
      info.location
    } | ${dateString}</h2>`
  }
}

function reloadAtTime(intendedTime, callback) {
  // if it's time, call the callback
  if (Date.now() > intendedTime) {
    callback && callback()
    return
  }

  // if the screen will change within 12 hours, show an indicator
  // on the screen
  var timer = document.querySelector('#timer')
  // but not if it's already changed to the sponsor image
  if (Date.now() > new Date(intendedTime - 60 * 60 * 1000 * 12) && !currentlyShowingSponsorImage) {
    timer.style.display = 'block'
    // update timer icon to correspond to the time things actually change?
    if (intendedTime && new Date(intendedTime).getHours() === 17) {
      timer.innerHTML = '🕔' // <- 5 o'clock
    }
  } else {
    document.querySelector('#timer').style.display = 'none'
    timer.innerHTML = '⏲'
  }

  // Otherwise, wait 60 seconds, or, if we're within 1 minute wait the amount
  // of seconds until the intended time
  // then re-call this function
  var waitInterval = Math.min(intendedTime - Date.now(), 60000)
  var funk = reloadAtTime.bind(this, intendedTime, callback)
  // idea -> somehow harness multiple pis running chromium to
  // log all console messages back to signage HQ?
  console.info(
    'reloatAtTime is waiting ',
    waitInterval,
    'ms and will go from there',
    'in order to change the image on screen at ',
    new Date(intendedTime)
  )
  setTimeout(funk, waitInterval)
}

function nthDayOfMonth(dayName, week, dateModificationCallback, monthPad = 0) {
  var days = 'sunday monday tuesday wednesday thursday friday saturday'.split(
    ' '
  )
  var desiredDayNumber = days.indexOf(dayName.toLowerCase())

  var date = new Date()
  var day1 = new Date(date.getFullYear(), date.getMonth() + monthPad, 1)

  var firstDesiredDate = new Date(
    day1.setDate(
      ((day1.getDate() + (desiredDayNumber - 1 - day1.getDay() + 7)) % 7) + 1
    )
  )
  var desiredDate = new Date(
    firstDesiredDate.setDate(firstDesiredDate.getDate() + 7 * (week - 1))
  )

  // if it's already past the target date, jump forward a month
  if (desiredDate < new Date().setHours(0, 0, 0, 0))
    return nthDayOfMonth(
      dayName,
      week,
      dateModificationCallback,
      (monthPad = 1)
    )

  return dateModificationCallback
    ? dateModificationCallback(desiredDate)
    : desiredDate
}

function toggleCaption(show = true) {
  let showOrHide = show ? 'visible' : 'hidden'

  Array.from(document.querySelectorAll('.caption, .gradient-overlay')).map(
    el => (el.style.visibility = showOrHide)
  )
}
