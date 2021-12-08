// File origin: VS1LAB A2 

/**
 * A class to help using the HTML5 Geolocation API.
 */
// eslint-disable-next-line no-unused-vars
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

    /**
     * Create LocationHelper instance if coordinates are known.
     * @param {string} latitude 
     * @param {string} longitude 
     */
    constructor(latitude, longitude) {
        this.#latitude = (parseFloat(latitude)).toFixed(5);
        this.#longitude = (parseFloat(longitude)).toFixed(5);
    }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }
        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
           
            helper.#latitude = location.coords.latitude.toFixed(5);
            helper.#longitude = location.coords.longitude.toFixed(5);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message)
        });
    }

    /**
     * Reading out the position with findLocation.
     * If successful, latitude and longitude input fields of the tagging form and the discovery form (hidden input fields) 
     * will be searchend and the coordinates written in their value attributes.
     */
    static updateLocation(tags = []) {

        // Get the current location
        LocationHelper.findLocation(callback => {

            // Write the current location in the latitude and longitude fields
            document.getElementById("latitudeInput").value = callback.latitude;
            document.getElementById("longitudeInput").value = callback.longitude;
            document.getElementById("latitudeInputDiscovery").value = callback.latitude;
            document.getElementById("longitudeInputDiscovery").value = callback.longitude;

            // Generate a MapQuest image URL for the specified parameters and replace the Discovery Image
            document.getElementById("mapView").src = new MapManager('Grmt99KmIw7IkyWsTmDGvMGXfWFOeSG8')
                .getMapUrl(callback.latitude, callback.longitude, tags, 8);
        });
    }
}
