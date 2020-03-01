async function getCities() {
  let response = await fetch(`/5.php`)
  let data = await response.json()
  return data
}

function processData(data) {
    let { cities } = data

    if (cities.length > 0) {
       showCity(cities)
    }
    else {
        showNoCity()
    }
}

function showNoCity() {
    document.getElementById('city').innerHTML = `Hmm. It doesn’t appear to be 5 o’clock anywhere right now.`
}

function showCity(cities) {
    let city = cities[Math.floor(Math.random() * cities.length)]
    let url = `https://www.google.com/maps/search/${city.replace(' ', '+')}/`
    let link = `<p><a href="${url}">${city}</a></p>`
    document.getElementById('city').innerHTML = link
}

function init() {
    let data = getCities()
    data.then(processData)
}

document.addEventListener('DOMContentLoaded', init)
