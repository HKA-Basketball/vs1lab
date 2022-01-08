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
    #curID = 0;

    constructor() {
        //this.#geoTagList = GeoTagExamples.tagListAsGeoTags;
        for (let i in GeoTagExamples.tagListAsGeoTags)
        {
            this.#geoTagList.push({id:this.#curID++, GeoTag:GeoTagExamples.tagListAsGeoTags[i]});
        }
    }

    showGeoTags()
    {
        return this.#geoTagList.map(x => x.GeoTag);
    }

    /**
     * Add a geotag
     * @param {GeoTag} geoTag 
     */
    addGeoTag(geoTag) {
        this.#geoTagList.push({id:this.#curID++, GeoTag:geoTag});
    }

    /**
     * Add a geotag & returns it
     * @param {GeoTag} geoTag 
     * @returns {GeoTag}
     */
    addGeoTagRet(geoTag) {
        this.#geoTagList.push({id:this.#curID++, GeoTag:geoTag});

        return this.#geoTagList[this.#geoTagList.length - 1];
    }

    /**
     * Delete geotags by name
     * @param {string} name 
     */
    removeGeoTag(name) {
        this.#geoTagList = this.#geoTagList.filter(geoTag => (geoTag.GeoTag.name !== name));
    }

    /**
     * Calculate the distance between to locations.
     * This function will work near the equator 
     * but WILL NOT WORK near the poles!
     * @param {GeoTag} location1 
     * @param {GeoTag} location2 
     */
     distance(location1, location2) {

        let p1 = location1.longitude;
        let p2 = location1.latitude;
        let q1 = location2.longitude;
        let q2 = location2.latitude;

        // bare euclidean distance 
        let distInDeg = Math.sqrt(Math.pow((q1 - p1), 2) + Math.pow((q2 - p2), 2));

        const radius = 1.2; // inKM 
        const radiusInDeg = (radius / 40075 * 360);

        return distInDeg <= radiusInDeg;
    }

    /**
     * Returns all geotags in the proximity of a location
     * @param {GeoTag} location 
     * @param {boolean} retOnlyGeotags 
     * @returns {GeoTag[]}
     */
    getNearbyGeoTags(location, retOnlyGeotags = false) {
        let nearbyGeoTags = this.#geoTagList.filter(geoTag => this.distance(location, geoTag.GeoTag));

        //return only Geotags
        if (retOnlyGeotags)
        {
            for (let i in nearbyGeoTags)
            {
                nearbyGeoTags[i] = nearbyGeoTags[i].GeoTag;
            }
        }

        return nearbyGeoTags;
    }

    /**
     * Returns all geotags in the proximity of a location that match a keyword
     * @param {GeoTag} location 
     * @param {string} partName 
     * @param {string} partHashtag 
     * @param {boolean} retOnlyGeotags 
     * @returns {GeoTag[]}
     */
    searchNearbyGeoTags(location, partName, partHashtag, retOnlyGeotags = false) {
        
        // get all surrounding geoTags
        let nearbyGeoTags = this.getNearbyGeoTags(location);

        // if possible filter by name and/or hashtag
        if (partName || partHashtag) {
            nearbyGeoTags = nearbyGeoTags.filter(geoTag => { 
                return geoTag.GeoTag.name.includes(partName) || geoTag.GeoTag.hashtag.includes(partHashtag) 
            });
        }

        //return only Geotags
        if (retOnlyGeotags)
        {
            for (let i in nearbyGeoTags)
            {
                nearbyGeoTags[i] = nearbyGeoTags[i].GeoTag;
            }
        }

        return nearbyGeoTags;
    }

    /**
     * Return geotag with requested primary key
     * @param {id} primarykey
     * @returns {GeoTag}
     */
    searchGeoTagByID(primarykey)
    {
        let getIndex = this.#geoTagList.findIndex(geotag => geotag.id == primarykey);
        return this.#geoTagList[getIndex];
    }

    /**
     * Return all other geotags without the requested primary key
     * @param {id} primarykey
     * @returns {GeoTag}
     */
    deletGeoTagByID(primarykey)
    {
        let deletedGeoTag = this.searchGeoTagByID(primarykey);

        let geotagIndex = this.#geoTagList.findIndex(geotag => geotag.id == primarykey);
        this.#geoTagList.splice(geotagIndex, 1);
        return deletedGeoTag;
    }

    /*
    [
        {
            id:11,
            GeoTag:
            {
                ....
            }
        },



    ]
    
    
    */

    /**
     * Returns geotag with edited values
     * @param {id} primarykey
     * @param {GeoTag} newData
     * @returns {GeoTag}
     */
    editGeoTagByID(primarykey, newData)
    {
        let geotag = this.searchGeoTagByID(primarykey).GeoTag;
        let newLatitude = 0.0;
        let newLongitude = 0.0;
        let newName = '';
        let newHashtag = '';

        if (newData.latitude !== 0.0)
            newLatitude = newData.latitude;
        else
            newLatitude = geotag.latitude;

        if (newData.longitude !== 0.0)
            newLongitude = newData.longitude;
        else
            newLongitude = geotag.longitude;

        if (newData.name !== '')
            newName = newData.name;
        else
            newName = geotag.name;

        if (newData.hashtag !== '' && newData.hashtag.startsWith('#'))
            newHashtag = newData.hashtag;
        else
            newHashtag = geotag.hashtag;


        const newGeoTagData = new GeoTag(
            parseFloat(newLatitude),
            parseFloat(newLongitude),
            newName,
            newHashtag
        );
        
        //Update List
        let getIndex = this.#geoTagList.findIndex(geotag => geotag.id == primarykey);
        this.#geoTagList[getIndex].GeoTag = newGeoTagData;

        return this.#geoTagList[getIndex];
    }
}

module.exports = InMemoryGeoTagStore
