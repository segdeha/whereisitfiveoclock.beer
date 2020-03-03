/**
 * None of what’s in here is rocket science. Heck, it’s barely computer science, but I’d
 * appreciate it if you let me know if you use any of it or learned something from it.
 * Email me at: andrew@hedges.name
 */

let TYPING_SPEED_FAST = 'fast'

function init() {
    // give the user a second+ to get oriented before erasing the original string
    setTimeout(getCity, 1500)
    document.querySelector('button').addEventListener('click', getCity)
}

function getCity() {
    toggleButton()
    backspace()
    window.requestAnimationFrame(() => {
       let data = getCities()
       data.then(processData)
    })
}

function toggleButton() {
    let button = document.querySelector('button')
    button.disabled = !button.disabled
}

// generate random intervals to make it look more like a human is typing
function typingJitter(speed = 'slow') {
    let max = 256
    let min = 64
    if (TYPING_SPEED_FAST === speed) {
        max = 64
        min = 32
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// remove the <a></a> if it exists, replacing it with the text inside it
function removeA(el) {
    let str = el.innerHTML
    let a = city.querySelector('a')
    if (a) {
        let linkTxt = a.innerHTML
        let newStr = str.replace(/<a .*>.*<\/a>/, a.innerHTML)
        el.innerHTML = newStr
    }
}

// erase the entire string inside [id="city"]
function backspace() {
    let city = document.getElementById('city')

    // first, remove the <a></a> if it exists (used when generating a 2nd city)
    removeA(city)

    function back() {
        let txt = city.innerHTML
        if (city.innerHTML.length > 0) {
           city.innerHTML = txt.slice(0, txt.length - 1)
           setTimeout(back, typingJitter(TYPING_SPEED_FAST))
        }
    }
    back()
}

async function getCities() {
    let buster = Math.floor(+new Date() / 100000)
    let response = await fetch(`/5.php?${buster}`)
    let data = await response.json()
    return data
}

function processData(data) {
    let { cities } = data

    let city = document.getElementById('city')

    function waiting() {
        if (city.innerHTML.length > 0) {
            window.requestAnimationFrame(waiting)
        }
        else {
            // wait the length of the longest possible typing jitter before adding
            // new text
            setTimeout(showing, 256)
        }
    }

    function showing() {
        if (cities.length > 0) {
            showCity(cities)
        }
        else {
            showNoCity()
        }
        toggleButton()
    }

    waiting()
}

/**
 * Simulate typing
 * @param el Node Element into which the typing will happen
 * @param str String String being typed
 * @param speed String Speed at which to type ('slow' | 'fast')
 * @param period Boolean Whether or not to add a period to the end of the string
 */
function typeString(el, str, speed = 'slow', period = false) {
    let chars = str.split('')
    function type() {
        el.innerHTML = el.innerHTML + chars.shift()
        if (chars.length > 0) {
            setTimeout(type, typingJitter(speed))
        }
        else if (period) {
            if ('A' === el.tagName) {
               el.parentNode.innerHTML = el.parentNode.innerHTML + '.'
            }
            else {
               el.innerHTML = el.innerHTML + '.'
            }
        }
    }
    type()
}

// choose a new city, make it different from the last one
function getRandomCity(cities) {
    let savedLoc = window.localStorage.getItem('loc')
    let loc = cities[Math.floor(Math.random() * cities.length)]
    if (loc && cities.length > 1) {
        while (loc === savedLoc) {
            loc = cities[Math.floor(Math.random() * cities.length)]
        }
    }
    window.localStorage.setItem('loc', loc)
    return loc
}

function showCity(cities) {
    let city = document.getElementById('city')
    let loc = getRandomCity(cities)
    let url = `https://www.google.com/maps/search/${loc.replace(' ', '+')}/`
    typeString(city, 'in ', TYPING_SPEED_FAST)
    setTimeout(() => {
        city.innerHTML = city.innerHTML + `<a href="${url}" target="_blank"></a>`
        typeString(city.querySelector('a'), loc, 'slow', true)
    }, 64 * 3) // wait max possible typing jitter (fast)
}

function showNoCity() {
    let city = document.getElementById('city')
    typeString(city, 'nowhere? Is that possible?')
}

document.addEventListener('DOMContentLoaded', init)
