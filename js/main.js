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

// Called-back by Google Maps API in index.html
function initMap() {
    // Getting map element from the WebPage
    var mapElement = document.getElementById('map');
    // Storing the map options in a variable for ease of use
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(54.984429, -1.616676),
        styles: [{
            'featureType': 'administrative.locality',
            'elementType': 'all',
            'stylers': [{'hue': '#2c2e33'}, {'saturation': 7}, {'lightness': 19}, {'visibility': 'on'}]
        }, {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers': [{'hue': '#ffffff'}, {'saturation': -100}, {'lightness': 100}, {'visibility': 'simplified'}]
        }, {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [{'hue': '#ffffff'}, {'saturation': -100}, {'lightness': 100}, {'visibility': 'off'}]
        }, {
            'featureType': 'road',
            'elementType': 'geometry',
            'stylers': [{'hue': '#bbc0c4'}, {'saturation': -93}, {'lightness': 31}, {'visibility': 'simplified'}]
        }, {
            'featureType': 'road',
            'elementType': 'labels',
            'stylers': [{'hue': '#bbc0c4'}, {'saturation': -93}, {'lightness': 31}, {'visibility': 'on'}]
        }, {
            'featureType': 'road.arterial',
            'elementType': 'labels',
            'stylers': [{'hue': '#bbc0c4'}, {'saturation': -93}, {'lightness': -2}, {'visibility': 'simplified'}]
        }, {
            'featureType': 'road.local',
            'elementType': 'geometry',
            'stylers': [{'hue': '#e9ebed'}, {'saturation': -90}, {'lightness': -8}, {'visibility': 'simplified'}]
        }, {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [{'hue': '#e9ebed'}, {'saturation': 10}, {'lightness': 69}, {'visibility': 'on'}]
        }, {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': [{'hue': '#e9ebed'}, {'saturation': -78}, {'lightness': 67}, {'visibility': 'simplified'}]
        }]
    };
    getJSONData(function (data) {
        getMarkerInfo(map, data)
    });
    // Creating a Google Map using the map element and options as parameters
    map = new google.maps.Map(mapElement, mapOptions);
}

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

function getMarkerInfo(map, data) {
    // Storing the JSON object path in a variable to save space
    var restaurantList = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;
    // Counters to control how many of each rating to include, must be outside the for loop or they will redefine each iteration
    var numberOfRating1s = 0;
    var numberOfRating2s = 0;
    var numberOfRating3s = 0;
    var numberOfRating4s = 0;
    var numberOfRating5s = 0;

    for (var i = 0; i < 25; i++) {
        // Making sure current restaurant iteration actually has a geocode
        if (typeof restaurantList[i].Geocode !== 'undefined') {

            var restaurantRating = restaurantList[i].RatingValue;
            var restaurantName = restaurantList[i].BusinessName;
            var restaurantAddress = restaurantList[i].AddressLine1 + ', ' + restaurantList[i].AddressLine2;
            // Some restaurants have 3 address lines, if this is the case include them, if not just add postcode
            if (typeof restaurantList[i].AddressLine3 !== 'undefined') {
                restaurantAddress += ', ' + restaurantList[i].AddressLine3 + '. ' + restaurantList[i].PostCode + '.';
            } else {
                restaurantAddress += '. ' + restaurantList[i].PostCode + '.';
            }
            // Creating an object from the geocode so Google Maps can read use it
            var restaurantLagLng = new google.maps.LatLng(parseFloat(restaurantList[i].Geocode.Latitude), parseFloat(restaurantList[i].Geocode.Longitude));
            /*
                An if else that counts the number of restaurants iterated with a specific rating,
                Once 5 of a rating have been passed no more of that rating will meet the criteria
                to be added to the map
             */
            if ((restaurantRating = 1) && (numberOfRating1s < 5)) {
                addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating);
                numberOfRating1s++;
            } else if ((restaurantRating = 2) && (numberOfRating2s < 5)) {
                addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating);
                numberOfRating2s++;
            } else if ((restaurantRating = 3) && (numberOfRating3s < 5)) {
                addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating);
                numberOfRating3s++;
            } else if ((restaurantRating = 4) && (numberOfRating4s < 5)) {
                addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating);
                numberOfRating4s++;
            } else if ((restaurantRating = 5) && (numberOfRating5s < 5)) {
                addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating);
                numberOfRating5s++;
            }
            console.log(restaurantName + '. ' + restaurantAddress + ' Rating: ' + restaurantRating + '.');
        }
    }
}
// Making the user location variable global (outside a function) to share it with other functions
var userLocation;
var geolocationSupport;
var distanceElement = document.getElementsByClassName('distance-from-location')[0];

if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position){
         // Browser geolocation success
         userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         console.log('Geolocation finished, user location: ' + position.coords.latitude + ', ' + position.coords.longitude);
         distanceElement.innerHTML = 'Hover over a restaurant, browser has found your location';
         // add New marker to show where user is on the map
         var marker = new google.maps.Marker({
             map: map,
             icon: 'resources/img/user-marker.svg',
             position: userLocation
         });
         var infoWindow = new google.maps.InfoWindow({
             content: '<div class="location-info"><p class="bold">Your location</p></div>'
         });
         marker.addListener('mouseover', function () {
             infoWindow.open(map, marker);
         });
         marker.addListener('mouseout', function () {
             infoWindow.close(map, marker);
         });}, function(error){
         // Browser geolocation failure
         distanceElement.innerHTML = 'Browser could not find your location';
         console.log('Geolocation failed: ' + error.message);
     });
} else {
    // Browser geolocation not supported
    distanceElement.innerHTML = "Distance could not be calculated, Geolocation not supported";
    geolocationSupport = false;
}

/*  ---------------------------------------------
 *  SERVICES
 *  ------------------------------------------ */

function addMapMarker(map, restaurantName, restaurantAddress, restaurantLagLng, restaurantRating) {

    var restaurantNameVar = restaurantName;
    var restaurantAddressVar = restaurantAddress;
    var restaurantLatLngVar = restaurantLagLng;
    // Changing Restaurant rating to be an actual number not string (of a number)
    var restaurantRatingVar = parseInt(restaurantRating);

    var marker = new google.maps.Marker({
        map: map,
        icon: 'resources/img/map-marker.svg',
        position: restaurantLagLng
    });

    var infoWindow = new google.maps.InfoWindow({
        content: '<div class="location-info"><p class="bold">' + restaurantName + '</p>' +
        '<p class="location-info__address">' + restaurantAddress + '</p>' +
        '<p>Rating: ' + restaurantRatingVar + '</p></div>'
    });

    marker.addListener('mouseover', function () {
        var nameElement = document.getElementsByClassName('restaurant__name')[0];
        var addressElement = document.getElementsByClassName('restaurant__address')[0];
        var ratingElement = document.getElementsByClassName('restaurant__rating')[0];
        //var tweetsElement = document.getElementsByClassName('restaurant__tweets')[0];
        if((userLocation) && (geolocationSupport !== false)){
            distanceElement.innerHTML = restaurantNameVar + ' is <span class="distance-away"></span> from your location';
            calculateDistance(restaurantLatLngVar);
        } else if ((!userLocation) && (geolocationSupport !== false)){
            distanceElement.innerHTML = 'Browser still finding your location';
        }
        // Open the infoWindow related to the marker and update the HTML of the side panel
        infoWindow.open(map, marker);
        nameElement.innerHTML = restaurantNameVar;
        addressElement.innerHTML = restaurantAddressVar;
        // Making a container for the star rating
        var starContainer = '';
        for (var i = 0; i < restaurantRatingVar; i++) {
            starContainer += '<span class="icon-star"></span>';
        }
        ratingElement.innerHTML = starContainer;
    });

    marker.addListener('mouseout', function () {
        // Closing the infoWindow when mouse move away BUT notice no unsetting of the side panel because users wouldn't have a chance to read it
        infoWindow.close(map, marker);
    });
}

function calculateDistance(restaurantLatLngVar) {

    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [restaurantLatLngVar],
        destinations: [userLocation],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, callback);
}

function callback(response, status) {

    if (status === google.maps.DistanceMatrixStatus.OK) {
        if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
            distanceElement.innerHTML = 'You might need a boat or plane!';
        } else {
            var distanceInnerElement = document.getElementsByClassName('distance-away')[0];
            var distance = response.rows[0].elements[0].distance;
            distanceInnerElement.innerHTML = distance.text;
        }
    } else {
        distanceElement.innerHTML = 'Distance could not be calculated, Google Maps error';
    }
}

/*  ---------------------------------------------
 *  AESTHETICS
 *  ------------------------------------------ */

function smoothScrollWhatsOn(){
    var scrollTo = document.getElementsByClassName('divider')[0];
    // + 70(px) because nav is fixed at highest z-index so content will appear underneath it
    window.scroll({ top: (scrollTo.offsetTop + -70), left: 0, behavior: 'smooth' });
}

function smoothScrollGetInvolved(){
    var scrollTo = document.getElementsByClassName('divider')[1];
    // + 70(px) because nav is fixed at highest z-index so content will appear underneath it
    window.scroll({ top: (scrollTo.offsetTop + -70), left: 0, behavior: 'smooth' });
}