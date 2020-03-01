function init() {
    let data = getCities()
    data.then(processData)
}

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
