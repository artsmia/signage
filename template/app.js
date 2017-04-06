function reloadAtTime(intendedTime, callback) {
  // if it's time, call the callback
  if (Date.now() > intendedTime) {
    callback && callback()
    return
  }
  
  // Otherwise, wait 60 seconds, or, if we're within 1 minute wait the amount
  // of seconds until the intended time, wait that much
  // to re-call this function
  var waitInterval = Math.min(intendedTime - Date.now(), 60000)
  var funk = reloadAtTime.bind(this, intendedTime, callback)
  // idea -> somehow harness multiple pis running chromium to
  // log all console messages back to signage HQ?
  console.info(
    'reloatAtTime is waiting ',
    waitInterval,
    'ms and will go from there',
    'in order to change the image on screen at ',
    intendedTime,
  )
  setTimeout(funk, waitInterval)
}

if (name == "LOWER-LOBBY") {
  imageString = "LL-right.jpg"
  var timeToChange = new Date('2017-04-08 16:45')
  var timeToChangeBack = new Date('2017-04-09 21:00')

  if (window.location.search.match('debug')) {
    // `?debug` will trigger the change 5 seconds after loading and change back in 9
    timeToChange = Date.now() + 5000
    timeToChangeBack = Date.now() + 9000
  }

  console.info(
    'will change to family day screen at ',
    new Date(timeToChange),
    'and back to the regularly scheduled programming at',
    new Date(timeToChangeBack),
    '(right now, it is)',
    new Date(),
  )

  reloadAtTime(timeToChange, function() {
    console.info("hey it's family day!")
    image.src = './family.jpg'
    reloadAtTime(timeToChangeBack, function() {
      console.info("it's not family day any more!")
      image.src = imageString
    })
  })
}

var images = imageString.split(" ").map(function(img) {
  return img
})


var image = document.createElement('img')
image.src = './'+images[0]

document.body.appendChild(image)

if(caption !== "") {
  var text = document.createElement('div')
  text.classList.add('caption')
  var captionJson;
  try {
    captionJson = JSON.parse(caption)
    fancyCaption()
  } catch(test) {
    captionJson = false
    text.innerHTML = caption
  }

  if(captionJson && Object.values(captionJson)[0].id) {
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

var transition = images.length > 1 && setInterval(function() {
  var relativeImageName = image.src.match(/[^\/]+\.jpg$/)[0]
  var currentIndex = images.indexOf(relativeImageName)
  var nextIndex = (currentIndex+1) % (images.length-1)

  if(captionJson) {
    var info = captionJson[images[nextIndex]]
    // skip to the next if:
    // an object is not on view per TMS
    // or an exhibition has ended per the calendar
    while(info.location == 'Not on View' || info.dateTo && new Date(info.dateTo) < new Date()) {
      images.splice(nextIndex, 1)
      console.info('not on view or ended, skipping', info)
      nextIndex = (currentIndex+1) % (images.length-1)
      info = captionJson[images[nextIndex]]
    }
  }

  var nextImage = images[nextIndex]
  image.src = './'+nextImage
  if(captionJson) image.onload = fancyCaption
}, 11000)

function fancyCaption() {
  var relativeImageName = image.src.match(/[^\/]+\.jpg$/)[0]
  var info = captionJson[relativeImageName]
  if(info.id) return
  text.innerHTML = `<h1>${info.title}</h1> <h2>${info.location}</h2>`
}

