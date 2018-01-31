var showSpecificImage = window.location.hash.replace('#', '')
var showLeftOrRightImage = showSpecificImage !== '' && showSpecificImage
var currentlyShowingSponsorImage = false
var currentlyShowingEventImage = false
// Show the `Third Thursday / Family Day` thank you message
// on all LOWER-LOBBY screens
// except the left of the two in the lower lobby screens
// (this is also used on the single screen in the Target lobby)
if (name == 'LOWER-LOBBY') {
  if (showLeftOrRightImage === 'left') {
    imageString = 'LL-left-1.jpg LL-left-2.jpg LL-left-3.jpg LL-left-4.jpg'
  }

  if (showLeftOrRightImage !== 'left') {
    imageString = 'LL-right-1.jpg LL-right-2.jpg LL-right-3.jpg LL-right-4.jpg'
    Array.from(document.querySelectorAll('.caption')).map(
      el => (el.style.visibility = 'hidden')
    )
    var nextThirdThursday = nthDayOfMonth('Thursday', 3, date => {
      date.setHours(17)
      date.setMinutes(30)
      return date
    })
    var nextFamilyDay = nthDayOfMonth('Sunday', 2)
    var pdFair = nthDayOfMonth('Friday', 1, date => {
      date.setHours(15)
      date.setMinutes(00)
      return date
    })
    // For debugging
    // var nextToday = new Date().setHours(0, 0, 0, 0)
    // var sponsoredDays = [nextFamilyDay, nextThirdThursday, nextToday]

    // if it's between the start time of a sponsored event and 11pm that day,
    // we want to show the sponsor screen
    var sponsoredDays = [nextFamilyDay, nextThirdThursday]
      .sort((d1, d2) => d1 >= d2)
      .filter(d => d >= new Date().setHours(0, 0, 0, 0))

    //var Event = []
    //.sort((d1, d2) => d1 >= d2)
    //.filter(d => d >= new Date().setHours(0, 0, 0, 0))

    var timeToChange, timeToChangeBack

    if (sponsoredDays.length > 0) {
      timeToChange = sponsoredDays[0]
      timeToChangeBack = (d1 = new Date(timeToChange)).setHours(23) // 11pm that day
    }
    if (Event.length > 0) {
      timeToChangeEvent = Event[0]
      timeToChangeEventBack = (d1 = new Date(timeToChangeEvent)).setHours(23) // 11pm that day
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
        var imageFile = './PnD_Fair17_DigitalPrices_White.jpg'
        console.info('showing PD Fair image for', day, imageFile)
        image.src = imageFile
        currentlyShowingEventImage = true
        Array.from(document.querySelectorAll('.caption')).map(
          el => (el.style.visibility = 'hidden')
        )
        reloadAtTime(timeToChangeEventBack, function() {
          console.info('leaving sponsor image')
          currentlyShowingEventImage = false
          Array.from(document.querySelectorAll('.caption')).map(
            el => (el.style.visibility = 'visible')
          )
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
        Array.from(document.querySelectorAll('.caption')).map(
          el => (el.style.visibility = 'hidden')
        )
        reloadAtTime(timeToChangeBack, function() {
          console.info('leaving sponsor image')
          currentlyShowingSponsorImage = false
          Array.from(document.querySelectorAll('.caption')).map(
            el => (el.style.visibility = 'visible')
          )
          image.src = imageString.split(' ')[0]
          setTimeout(window.location.reload, 1000) // reload to set up for the next sponsored event
        })
      })
    }

    if (timeToChange) {
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
    if (timeToChangeEvent) {
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
  }
}
if (name == 'TARGET-ATRIUM') {
  imageString = 'atrium-1.jpg atrium-2.jpg atrium-3.jpg atrium-4.jpg'

  //if (showLeftOrRightImage !== '' && showLeftOrRightImage !== 'left') {
  var nextThirdThursday = nthDayOfMonth('Thursday', 3, date => {
    date.setHours(17)
    date.setMinutes(30)
    return date
  })
  var nextFamilyDay = nthDayOfMonth('Sunday', 2)
  var pdFair = nthDayOfMonth('Friday', 1, date => {
    date.setHours(15)
    date.setMinutes(00)
    return date
  })
  // For debugging
  // var nextToday = new Date().setHours(0, 0, 0, 0)
  // var sponsoredDays = [nextFamilyDay, nextThirdThursday, nextToday]

  // if it's between the start time of a sponsored event and 11pm that day,
  // we want to show the sponsor screen
  var sponsoredDays = [nextFamilyDay, nextThirdThursday]
    .sort((d1, d2) => d1 >= d2)
    .filter(d => d >= new Date().setHours(0, 0, 0, 0))

  //var Event = []
  //.sort((d1, d2) => d1 >= d2)
  //.filter(d => d >= new Date().setHours(0, 0, 0, 0))

  var timeToChange, timeToChangeBack

  if (sponsoredDays.length > 0) {
    timeToChange = sponsoredDays[0]
    timeToChangeBack = (d1 = new Date(timeToChange)).setHours(23) // 11pm that day
  }
  if (Event.length > 0) {
    timeToChangeEvent = Event[0]
    timeToChangeEventBack = (d1 = new Date(timeToChangeEvent)).setHours(23) // 11pm that day
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
      var imageFile = './PnD_Fair17_DigitalPrices_White.jpg'
      console.info('showing PD Fair image for', day, imageFile)
      image.src = imageFile
      currentlyShowingEventImage = true
      Array.from(document.querySelectorAll('.caption')).map(
        el => (el.style.visibility = 'hidden')
      )
      reloadAtTime(timeToChangeEventBack, function() {
        console.info('leaving sponsor image')
        currentlyShowingEventImage = false
        Array.from(document.querySelectorAll('.caption')).map(
          el => (el.style.visibility = 'visible')
        )
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
      Array.from(document.querySelectorAll('.caption')).map(
        el => (el.style.visibility = 'hidden')
      )
      reloadAtTime(timeToChangeBack, function() {
        console.info('leaving sponsor image')
        currentlyShowingSponsorImage = false
        Array.from(document.querySelectorAll('.caption')).map(
          el => (el.style.visibility = 'visible')
        )
        image.src = imageString.split(' ')[0]
        setTimeout(window.location.reload, 1000) // reload to set up for the next sponsored event
      })
    })
  }

  if (timeToChange) {
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
  if (timeToChangeEvent) {
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
  //}
}
var images = imageString
  .split(' ')
  .map(function(img) {
    return img
  })
  .filter(img => !!img)

var image = document.createElement('img')
image.src = './' + images[0]

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

  if (captionJson && Object.values(captionJson)[0].id) {
    // temporarily, don't caption artworks
    // (because the images have the gallery hardcoded
    // and re-making them all is hard. Continue to use the
    // location info to skip "Not on View" objects)
  } else {
    var gradient = document.createElement('div')
    gradient.classList.add('gradient-overlay')

    document.body.appendChild(text)
    document.body.appendChild(gradient)
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
    }
  }, 11000)

/* utility functions
 */

function fancyCaption() {
  var relativeImageName = image.src.match(/[^\/]+\.jpg$/)[0]
  var info = captionJson[relativeImageName]
  if (info.id) return
  var endDate = new Date(info.dateTo)
  var month = 'Jan Feb Mar Apr May June July Aug Sep Oct Nov Dec'.split(' ')[
    endDate.getMonth()
  ]
  var endsString = month + ' ' + endDate.getDate()
  if (endDate.getFullYear() !== new Date().getFullYear())
    endsString += ' ' + endDate.getFullYear()

  text.innerHTML = `<h1>${info.title}</h1> <h2>${info.location} | Closes ${endsString}</h2>`
}

function reloadAtTime(intendedTime, callback) {
  // if it's time, call the callback
  if (Date.now() > intendedTime) {
    callback && callback()
    return
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
      (day1.getDate() + (desiredDayNumber - 1 - day1.getDay() + 7)) % 7 + 1
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
