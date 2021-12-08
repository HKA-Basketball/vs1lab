// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */
const GeoTag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geoTagList = [];

    constructor() {
        this.#geoTagList = GeoTagExamples.tagListAsGeoTags;
    }

    /**
     * Add a geotag
     * @param {GeoTag} geoTag 
     */
    addGeoTag(geoTag) {
        this.#geoTagList.push(geoTag);
    }

    /**
     * Delete geotags by name
     * @param {string} name 
     */
    removeGeoTag(name) {
        this.#geoTagList = this.#geoTagList.filter(geoTag => (geoTag.name !== name));
    }

    /**
     * Calculate the distance between to locations
     * @param {GeoTag} location1 
     * @param {GeoTag} location2 
     * @returns {number}
     */
    _distance(location1, location2) {
        // TODO
        return 0;
    }

    /**
     * Returns all geotags in the proximity of a location
     * @param {GeoTag} location 
     * @returns {GeoTag[]}
     */
    getNearbyGeoTags(location) {

        const radius = 100; // radius in Km
        let nearbyGeoTags = this.#geoTagList.filter(geoTag => this._distance(location, geoTag) <= radius);

        return nearbyGeoTags;
    }

    /**
     * Returns all geotags in the proximity of a location that match a keyword
     * @param {GeoTag} location 
     * @param {string} partName 
     * @param {string} partHashtag 
     * @returns {GeoTag[]}
     */
    searchNearbyGeoTags(location, partName, partHashtag) {
        
        // get all surrounding geoTags
        let nearbyGeoTags = this.getNearbyGeoTags(location);

        // if possible filter by name and/or hashtag
        if (partName || partHashtag) {
            nearbyGeoTags = nearbyGeoTags.filter(geoTag => { 
                return geoTag.name.includes(partName) || geoTag.hashtag.includes(partHashtag) 
            });
        }

        return nearbyGeoTags;
    }
}

module.exports = InMemoryGeoTagStore
