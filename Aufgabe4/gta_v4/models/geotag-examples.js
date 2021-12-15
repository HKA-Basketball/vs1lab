// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

 const GeoTag = require('./geotag');

/**
 * A class representing example geoTags at HKA
 * 
 * TODO: populate your InMemoryGeoTagStore with these tags
 * 
 */
class GeoTagExamples {
    /**
     * Provides some geoTag data
     */
    static get tagList() {
        return [
            ['Castle', 49.013790, 8.404435, '#sight'],
            ['IWI', 49.013790, 8.390071, '#edu'],
            ['Building E', 49.014993, 8.390049, '#campus'],
            ['Building F', 49.015608, 8.390112, '#campus'],
            ['Building M', 49.016171, 8.390155, '#campus'],
            ['Building LI', 49.015636, 8.389318, '#campus'],
            ['Auditorium He', 49.014915, 8.389264, '#campus'],
            ['Building R', 49.014992, 8.392365, '#campus'],
            ['Building A', 49.015738, 8.391619, '#campus'],
            ['Building B', 49.016843, 8.391372, '#campus'],
            ['Building K', 49.013190, 8.392090, '#campus'],
            ['Daniels hood', 49.026886, 8.392896, '#campus'],
            ['Elias hood', 49.02107, 8.37106, '#campus'],
            ['Noch ein punkt', 49.00100, 8.47390, '#campus'],
            ['P1', 44.794457, 9.518599, '#campus'],
            ['Nigeria',21.670110638322967, 11.8698258745779,'#campus'],
        ];
    }

    /**
     * for testing purposes
     */
    static get tagListAsGeoTags() {
        return this.tagList.map(tagEntry =>
            new GeoTag(tagEntry[1], tagEntry[2], tagEntry[0], tagEntry[3]));
    }
}

module.exports = GeoTagExamples;
