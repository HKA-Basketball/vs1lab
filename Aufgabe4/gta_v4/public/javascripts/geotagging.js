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
        taglistJson = JSON.parse(taglistJson).slice(0, 5);
        //console.log(taglistJson);

        // Update current location
        LocationHelper.updateLocation(taglistJson);
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
            let arrGeoTagSize = parseInt(document.getElementById("arrGeoTagSize").textContent);

            if (parseInt(document.getElementById("discoveryButtonWasPressed").textContent) == 1)
            {
                //Überhaupt nötig?!?! da man über die web site ja e nur seinen aktuellen standort adden kann
                //document.getElementById("latitudeInput").value;
                //document.getElementById("longitudeInput").value

                let searchVal = document.getElementById("searchInput").value;
                if (geoTagMap.GeoTag.name.includes(searchVal) || geoTagMap.GeoTag.hashtag.includes(searchVal))
                {
                    taglist.push(geoTagMap.GeoTag);
                    arrGeoTagSize++;
                }
            }
            else
            {
                taglist.push(geoTagMap.GeoTag);
                arrGeoTagSize++;
            }

            mapview.setAttribute("data-tags", JSON.stringify(taglist));

            let maxGeotags = 5;
            let lastPageNum = Math.ceil(arrGeoTagSize / maxGeotags);
            console.log("Max Pages: " + lastPageNum);

            let currentPage = parseInt(document.getElementById("curPage").textContent);

            let htmlPageInfos = `<div id="curPage">${currentPage}</div>/<div id="lastPage">${lastPageNum}</div> (<div id="arrGeoTagSize">${arrGeoTagSize}</div>)`;

            document.getElementById('pageInfos').innerHTML = htmlPageInfos;

            let firstPosOnPage = (currentPage - 1) * maxGeotags;
            let lastPosOnPage = firstPosOnPage + maxGeotags;

            updateView(taglist.slice(firstPosOnPage, lastPosOnPage))
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
            let geoTags = geoTagsMap.map(x => x.GeoTag);

            let maxGeotags = 5;
            let arrGeoTagSize = geoTags.length;
            let lastPageNum = Math.ceil(arrGeoTagSize / maxGeotags);
            console.log("Max Pages: " + lastPageNum);

            let newPageNum = 1;

            let htmlPageInfos = `<div id="curPage">${newPageNum}</div>/<div id="lastPage">${lastPageNum}</div> (<div id="arrGeoTagSize">${arrGeoTagSize}</div>)`;

            document.getElementById('pageInfos').innerHTML = htmlPageInfos;

            document.getElementById("mapView").setAttribute("data-tags", JSON.stringify(geoTags));

            let firstPosOnPage = (newPageNum - 1) * maxGeotags;
            let lastPosOnPage = firstPosOnPage + maxGeotags;
            
            document.getElementById("discoveryButtonWasPressed").innerHTML = "1";

            updateView(geoTags.slice(firstPosOnPage, lastPosOnPage))
        });
});

document.getElementById("nextPage").addEventListener("click", () => {
    console.log("nextPage");
    
    let lastPageNum = parseInt(document.getElementById("lastPage").textContent);
    let arrGeoTagSize = parseInt(document.getElementById("arrGeoTagSize").textContent);
    let newPageNum = parseInt(document.getElementById("curPage").textContent);

    if (newPageNum < lastPageNum)
        newPageNum += 1;
    else
        return;

    console.log(newPageNum);
    
    let url = `/api/geotags/page/`;
    url += `${newPageNum}&` || '&';
    if (parseInt(document.getElementById("discoveryButtonWasPressed").textContent) == 1)
    {
        url += `${document.getElementById("latitudeInput").value}&` || '&';
        url += `${document.getElementById("longitudeInput").value}&` || '&';
        url += `${document.getElementById("searchInput").value}` || '';
    }
    else
        url += '&&';

    
    console.log(url);

    let fetchData = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }

    fetch(url, fetchData)
        .then(response => response.json())
        .then(geoTagsMap => {
            let geoTags = geoTagsMap.map(x => x.GeoTag)

            updateView(geoTags);

            let htmlPageInfos = `<div id="curPage">${newPageNum}</div>/<div id="lastPage">${lastPageNum}</div> (<div id="arrGeoTagSize">${arrGeoTagSize}</div>)`;

            document.getElementById('pageInfos').innerHTML = htmlPageInfos;
        });
});

document.getElementById("privPage").addEventListener("click", () => {
    console.log("privPage");
    
    let lastPageNum = parseInt(document.getElementById("lastPage").textContent);
    let arrGeoTagSize = parseInt(document.getElementById("arrGeoTagSize").textContent);
    let newPageNum = parseInt(document.getElementById("curPage").textContent);

    if (newPageNum > 1)
        newPageNum -= 1;
    else
        return;

    console.log(newPageNum);
    
    let url = `/api/geotags/page/`;
    url += `${newPageNum}&` || '&';
    if (parseInt(document.getElementById("discoveryButtonWasPressed").textContent) == 1)
    {
        url += `${document.getElementById("latitudeInput").value}&` || '&';
        url += `${document.getElementById("longitudeInput").value}&` || '&';
        url += `${document.getElementById("searchInput").value}` || '';
    }
    else
        url += '&&';

    console.log(url);

    let fetchData = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }

    fetch(url, fetchData)
        .then(response => response.json())
        .then(geoTagsMap => {
            let geoTags = geoTagsMap.map(x => x.GeoTag)
            
            updateView(geoTags);

            let htmlPageInfos = `<div id="curPage">${newPageNum}</div>/<div id="lastPage">${lastPageNum}</div> (<div id="arrGeoTagSize">${arrGeoTagSize}</div>)`;

            document.getElementById('pageInfos').innerHTML = htmlPageInfos;
        });
});

function updateView(newList = []) {
    let htmllist = newList.map(function (gTag) { return `<li>${gTag.name} (${gTag.latitude},${gTag.longitude}) ${gTag.hashtag} </li>` })
        .join('\r\n');

    document.getElementById('discoveryResults').innerHTML = htmllist;

    LocationHelper.updateLocation(newList);
}