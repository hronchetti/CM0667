/**
 * CREATED BY: Harry Ronchetti
 * FOR: CM0667 Northumbria University Assignment
 *
 * FRAMEWORK/APPROACH: Model, View, Controller (MVC)
 *
 */

/*  ---------------------------------------------
 *  BUILDING MAP (VIEW)
 *  ------------------------------------------ */

function initMap() {
    // Getting map element from the WebPage
    var mapElement = document.getElementById('map');
    // Storing the map options in a variable for ease of use
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(54.984429, -1.616676),
        // Map overlay colours REF: Snazzy Maps (2018) Light Monochrome. Available at: https://snazzymaps.com/style/29/light-monochrome (Accessed: 5th April 2018)
        styles: [{'featureType':'administrative.locality','elementType':'all','stylers':[{'hue':'#2c2e33'},{'saturation':7},{'lightness':19},{'visibility':'on'}]},{'featureType':'landscape','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'simplified'}]},{'featureType':'poi','elementType':'all','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]},{'featureType':'road','elementType':'geometry','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':31},{'visibility':'on'}]},{'featureType':'road.arterial','elementType':'labels','stylers':[{'hue':'#bbc0c4'},{'saturation':-93},{'lightness':-2},{'visibility':'simplified'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'hue':'#e9ebed'},{'saturation':-90},{'lightness':-8},{'visibility':'simplified'}]},{'featureType':'transit','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':10},{'lightness':69},{'visibility':'on'}]},{'featureType':'water','elementType':'all','stylers':[{'hue':'#e9ebed'},{'saturation':-78},{'lightness':67},{'visibility':'simplified'}]}]
    };
    getJSONData(function (data){
        getMarkerInfo(map, data)
    });
    // Creating a Google Map using the map element and options as parameters
    var map = new google.maps.Map(mapElement, mapOptions);

}
// Initialising the map when the page loads
document.addEventListener('load', initMap);

/*  ---------------------------------------------
 *  CONTROLLERS
 *  ------------------------------------------ */

function getJSONData(callback) {
    // Using local version because can't seem to find JSON on the hygiene website (only XML)
    $.getJSON('resources/data/FHRS_json.json', /* DATA MODEL */
        function (data) {
            callback(data);
        }
    );
}

function getMarkerInfo(map, data){
    // Storing the JSON object path in a variable to save space
    var restaurantList = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
    // Counters to control how many of each rating to include
    var numberOfRating1s = 0;
    var numberOfRating2s = 0;
    var numberOfRating3s = 0;
    var numberOfRating4s = 0;
    var numberOfRating5s = 0;
    var geocoder = new google.maps.Geocoder();

    for(var i = 0; i < 15; i++) {

        var restaurantRating = restaurantList[i].RatingValue;
        var restaurantName = restaurantList[i].BusinessName + '. ';
        var restaurantAddress = restaurantList[i].AddressLine1 + ', ' + restaurantList[i].AddressLine2 + '. ' + restaurantList[i].PostCode;

        if ((restaurantRating = 1) && (numberOfRating1s < 3)) {

            addMapMarker(geocoder, map, restaurantAddress);
            numberOfRating1s ++;

        } else if ((restaurantRating = 2) && (numberOfRating2s < 3)){

            addMapMarker(geocoder, map, restaurantAddress);
            numberOfRating2s ++;

        } else if ((restaurantRating = 3) && (numberOfRating3s < 3)){

            addMapMarker(geocoder, map, restaurantAddress);
            numberOfRating3s ++;

        } else if ((restaurantRating = 4) && (numberOfRating4s < 3)){

            addMapMarker(geocoder, map, restaurantAddress);
            numberOfRating4s ++;

        } else if ((restaurantRating = 5) && (numberOfRating5s < 3)){

            addMapMarker(geocoder, map, restaurantAddress);
            numberOfRating5s ++;

        }
        console.log(restaurantName + restaurantAddress + '. Rating: ' + restaurantRating);
    }
}

function addMapMarker(geocoder, map, restaurantAddress){

    geocoder.geocode({'address': restaurantAddress}, function (results, status) {

        if (status === 'OK') {

            var marker = new google.maps.Marker({
                map: map,
                icon: 'resources/img/map-marker.svg',
                position: results[0].geometry.location
            });


        } else{
            console.log('Geocode not added because: ' + status);
        }
    });
}
/*marker.addListener('mouseover', function(restaurantName, restaurantRating, restaurantAddress){

    var nameElement = document.getElementsByClassName('restaurant__name')[0];
    var addressElement = document.getElementsByClassName('restaurant__address')[0];
    var ratingElement = document.getElementsByClassName('restaurant__rating')[0];
    var tweetsElement = document.getElementsByClassName('restaurant__tweets')[0];
    var distanceElement = document.getElementById('distance-from-location');

    nameElement.innerHTML = restaurantName;
    addressElement.innerHTML = restaurantAddress;

});*/