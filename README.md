# whereisitfiveoclock.beer

So you never again have to say “It’s 5 o’clock _somewhere…”_

If you dig it, consider tossing some 🍺💰 my way: [venmo.com/segdeha](https://venmo.com/segdeha)

## colophon

It was weirdly hard to answer the question, “where is it currently 5 o’clock?” I ended up cobbling together a solution using a couple of data sources and a bit of scripting.

I start by calling the `GET /list-time-zone` [endpoint](https://timezonedb.com/references/list-time-zone) on TimeZoneDB.com to get the current time in each time zone around the world.

I then loop through the results and pull out each time zone (`America/Los_Angeles`, `Europe/Andorra`, `Antarctica/McMurdo`, etc.) where the current hour is 17 (i.e. 5pm).

Next, I query a database I put together consisting of 2 tables, one containing 24,297 cities, the other that’s used to look up country names from country codes, both from [geonames.org](http://download.geonames.org/export/dump/).

Finally, I cache the JSON response I send back to the browser so it’s regenerated at most once per hour.

It works! ¯\\\_(ツ)_/¯

The spinning globe was, um…borrowed from a [blog post](https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html) by [Bjørn Sandvik](https://twitter.com/thematicmapping).
