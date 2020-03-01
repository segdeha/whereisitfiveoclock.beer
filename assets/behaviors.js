function init() {
    setTimeout(backspace, 1500)
    window.requestAnimationFrame(() => {
       let data = getCities()
       data.then(processData)
    })
}

function typingJitter() {
    return Math.floor(Math.random() * (192 - 64 + 1)) + 64
}

function backspace() {
    let city = document.getElementById('city')
    function back() {
        let txt = city.innerHTML
        if (city.innerHTML.length > 0) {
           city.innerHTML = txt.slice(0, txt.length - 1)
           setTimeout(back, typingJitter())
        }
    }
    back()
}

async function getCities() {
  let response = await fetch(`/5.php`)
  let data = await response.json()
  return data
}

function processData(data) {
    let { cities } = data

    let city = document.getElementById('city')

    function waiting() {
        if (city.innerHTML.length > 0) {
            setTimeout(waiting, 32)
        }
        else {
            showing()
        }
    }

    function showing() {
        if (cities.length > 0) {
           showCity(cities)
        }
        else {
            showNoCity()
        }
    }

    waiting()
}

function showCity(cities) {
    let city = cities[Math.floor(Math.random() * cities.length)]
    let url = `https://www.google.com/maps/search/${city.replace(' ', '+')}/`
    let link = `in <a href="${url}">${city}</a>.`
    document.getElementById('city').innerHTML = link
}

function showNoCity() {
    document.getElementById('city').innerHTML = `nowhere? Is that possible?`
}

document.addEventListener('DOMContentLoaded', init)
