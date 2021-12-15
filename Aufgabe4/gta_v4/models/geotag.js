// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    #latitude = 0.0;
    #longitude = 0.0;
    #name = '';
    #hashtag = '';

    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {string} name 
     * @param {string} hashtag 
     */
    constructor(latitude, longitude, name, hashtag) {
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#name = name;
        this.#hashtag = hashtag;
    }

    /**
     * @returns {number}
     */
    get latitude() {
        return this.#latitude;
    }

    /**
     * @param {number}
     */
    set latitude(latitude) {
        this.#latitude = latitude;
    }

    /**
     * @returns {number}
     */
    get longitude() {
        return this.#longitude;
    }

    /**
     * @param {number}
     */
    set longitude(longitude) {
        this.#longitude = longitude;
    }

    /**
     * @returns {string}
     */
    get name() {
        return this.#name;
    }

    /**
     * @param {string}
     */
    set name(name) {
        this.#name = name;
    }

    /**
     * @returns {string}
     */
    get hashtag() {
        return this.#hashtag;
    }

    /**
     * @param {string}
     */
    set hashtag(hashtag) {
        this.#hashtag = hashtag;
    }

    /**
     * Converts class variables into a Json String
     * @returns {GeoTag}
     */
    toJSON() {
        return {
            latitude: this.#latitude,
            longitude: this.#longitude,
            name: this.#name,
            hashtag: this.#hashtag
        }
    }
}

module.exports = GeoTag;
