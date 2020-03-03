<?php

/*

General algorithm:

1. Figure out in what time zone(s) it’s 5 o'clock
2. Look up cities in that/those time zone(s)

*/

require '/usr/home/segdeha/apps/whereisitfiveoclock.beer/dbsettings.php';

// location of cached response
define('FILENAME', '_cache.json');

// always work based on UTC
date_default_timezone_set('UTC');

// read cached file
$json = file_get_contents(FILENAME);

// decide whether we need to get new data
if ($json) {
    $obj = json_decode($json);

    // check last updated date/time
    $expiry = $obj->{'expiry'};

    // if current time is after the expiry, curl again
    $curl = time() > $expiry;
}
else {
    $curl = true;
}

if ($curl) {
    // get current times around the world
    $ch = curl_init('http://api.timezonedb.com/v2.1/list-time-zone?key=' . TIMEZONEDB_API_KEY . '&format=json');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $json = json_decode($response);

    // loop through results to find time zones where the base time (`date('G', timestamp)`) is 5
    $zones = array();
    foreach ($json->zones as $zone) {
        if (17 == date('G', $zone->timestamp)) {
            array_push($zones, $zone->zoneName);
        }
    }

    // construct query
    $query = "
        SELECT city_name, country_name
        FROM cities, country
        WHERE time_zone IN ('" . implode("','", $zones) . "')
        AND cities.country_code = country.country_code
    ";

    // look up cities based on the time zones found in the previous step
    $lnk = mysql_connect(DBSERVER, USERNAME, PASSWORD)
        or die ('Not connected: ' . mysql_error());
    mysql_select_db(DATABASE, $lnk)
        or die ("Can’t use <strong>" . DATABASE . '</strong>: ' . mysql_error());
    mysql_set_charset("utf8"); // <- required to make json_encode work

    $results = mysql_query($query)
        or die ('<strong>MySQL Error:</strong> ' . mysql_error() . "<pre>$query</pre>");

    $cities = [];
    while ($row = mysql_fetch_assoc($results)) {
        array_push($cities, $row['city_name'] . ', ' . $row['country_name']);
    }

    mysql_close();

    // construct JSON that reflects the cities
    $minutes_until_top_of_the_hour = 30 - date('i'); // 30 minutes because india
    $seconds_until_top_of_the_hour = $minutes_until_top_of_the_hour * 60;

    $response = array(
        'status' => 'success',
        'expiry' => time() + $seconds_until_top_of_the_hour,
        'cities' => $cities,
    );

    $json = json_encode($response);

    // cache the result
    file_put_contents(FILENAME, $json, LOCK_EX);
}

// return response
header('Content-Type: application/json');
echo $json;

exit;
