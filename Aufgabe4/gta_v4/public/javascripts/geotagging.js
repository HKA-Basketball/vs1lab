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