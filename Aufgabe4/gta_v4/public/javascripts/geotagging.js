// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {

    // Don't update the Location if the values are already retrieved
    if (!document.getElementById("latitudeInput").value || !document.getElementById("longitudeInput").value
        || !document.getElementById("latitudeInputDiscovery").value || !document.getElementById("longitudeInputDiscovery").value) {

        // Get the List of GeoTags in the maps data-tags
        let taglistJson = document.getElementById("mapView").getAttribute("data-tags");

        // Update current location
        LocationHelper.updateLocation(JSON.parse(taglistJson));
    }
});


document.getElementById("taggingButton").addEventListener("click", () => {
    console.log("taggingButton");
    let newGeoTag = {
        latitudeInput: parseFloat(document.getElementById("latitudeInput").value),
        longitudeInput: parseFloat(document.getElementById("longitudeInput").value),
        nameInput: document.getElementById("nameInput").value,
        hashtagInput: document.getElementById("hashtagInput").value
    }

    if ((newGeoTag.hashtagInput == '' || !newGeoTag.hashtagInput.startsWith('#')) || newGeoTag.nameInput == '')
        return;

    let fetchData = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGeoTag)
    }

    // je nachdem ob man immer die neusten tags haben will oder moeglichst wenig daten uebertragen moechte
    fetch('/api/geotags', fetchData)
        .then(response => response.json())
        .then(geoTagMap => {
            let mapview = document.getElementById("mapView");

            let taglist = JSON.parse(mapview.getAttribute("data-tags"));
            taglist.push(geoTagMap.GeoTag);
            mapview.setAttribute("data-tags", JSON.stringify(taglist));

            updateView(taglist)
        });

});


document.getElementById("discoveryButton").addEventListener("click", () => {
    console.log("discoveryButton");

    let url = `/api/geotags/${document.getElementById("latitudeInput").value}&${document.getElementById("longitudeInput").value}&`;
    url += `${document.getElementById("searchInput").value}` || '';

    let fetchData = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }

    // je nachdem ob man immer die neusten tags haben will oder moeglichst wenig daten uebertragen moechte
    fetch(url, fetchData)
        .then(response => response.json())
        .then(geoTagsMap => {
            let geoTags = geoTagsMap.map(x => x.GeoTag)
            document.getElementById("mapView").setAttribute("data-tags", JSON.stringify(geoTags));
            updateView(geoTags)});
        });


function updateView(newList = []) {
    let htmllist = newList.map(function (gTag) { return `<li>${gTag.name} (${gTag.latitude},${gTag.longitude}) ${gTag.hashtag} </li>` })
        .join('\r\n');

    document.getElementById('discoveryResults').innerHTML = htmllist;

    LocationHelper.updateLocation(newList);
}