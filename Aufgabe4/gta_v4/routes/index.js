// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require('../models/geotag-examples');
// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: geoTagStore.showGeoTags() })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

 router.post('/tagging', (req, res) => {

  const {latitudeInput, longitudeInput, nameInput, hashtagInput} = req.body;

  // create new geotag
  const geoTag = new GeoTag(
    parseFloat(latitudeInput),
    parseFloat(longitudeInput),
    nameInput,
    hashtagInput
  );
  
  console.log("/tagging");
  console.log(JSON.stringify(geoTag));

  // save new geotag
  geoTagStore.addGeoTag(geoTag);

  // show new geotag and surrounding geotags
  res.render('index', { taglist: geoTagStore.getNearbyGeoTags(geoTag, true) })
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {

  const {latitudeInput, longitudeInput, searchInput} = req.body;

  const geoTag = new GeoTag(
    parseFloat(latitudeInput),
    parseFloat(longitudeInput),
    searchInput,
    searchInput
  );

  console.log("/discovery");
  console.log(JSON.stringify(geoTag));

  // show new geotag and surrounding geotags
  res.render('index', { taglist: geoTagStore.searchNearbyGeoTags(geoTag, searchInput, searchInput, true) })
});

// API routes (A4)

router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
 router.get('/api/geotags/:latitudeInput&:longitudeInput&:searchInput?', (req, res) => {
  console.log("get geotags");
  const {latitudeInput, longitudeInput, searchInput} = req.params;

  const geoTag = new GeoTag(
    parseFloat(latitudeInput),
    parseFloat(longitudeInput),
    searchInput,
    searchInput
  );

  // show new geotag and surrounding geotags
  res.json(geoTagStore.searchNearbyGeoTags(geoTag, searchInput, searchInput));
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
 router.post('/api/geotags', (req, res) => {
  console.log("post geotags");

  const {latitudeInput, longitudeInput, nameInput, hashtagInput} = req.body;

  let geoTag = new GeoTag(
    parseFloat(latitudeInput),
    parseFloat(longitudeInput),
    nameInput,
    hashtagInput
  );

  res.json(geoTagStore.addGeoTagRet(geoTag));
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
 router.get('/api/geotags/:id', (req, res) => {
  // show geotag with requested ID
  console.log("get :id");
  res.json(geoTagStore.searchGeoTagByID(req.params.id));
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */
 router.put('/api/geotags/:id', (req, res) => {
  console.log("put :id");
  const {latitudeInput, longitudeInput, nameInput, hashtagInput} = req.body;

  /*
    PUT http://localhost:3000/api/geotags/:id HTTP/1.1
    Content-Type: application/json

    {
        "latitudeInput":X.XXXXX,
        "longitudeInput":X.XXXXX,
        "nameInput":"XXXX",
        "hashtagInput":"#XXXXXXXX"
    }  
  */
 
  const newGeoTagData = new GeoTag(
    parseFloat(latitudeInput),
    parseFloat(longitudeInput),
    nameInput,
    hashtagInput
  );
  
  res.json(geoTagStore.editGeoTagByID(req.params.id, newGeoTagData));
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
 router.delete('/api/geotags/:id', (req, res) => {
  console.log("delete :id");
  res.json(geoTagStore.deletGeoTagByID(req.params.id));
});

module.exports = router;
