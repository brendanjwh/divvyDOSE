// Initialize a google maps using the gmaps library.
// var map = new GMaps({
//   el: "#map",
//   lat: "0",
//   lng: "0",
//   zoom: 1
// });

// Initialize the favorite locations array which is kept in localStorage

// if (!localStorage.hasOwnProperty("favorite-locations")) {
//   localStorage.setItem("favorite-locations", JSON.stringify([]));
// }

// hasFavoriteLocations = JSON.parse(localStorage.getItem("favorite-locations"))
//   .length
//   ? true
//   : false;
var initialLocation = $("#address")
  .val()
  .trim();

var theLocation;
var map;

// Form submit and Search icon handlers
$(".glyphicon-search").click(showLocationByAddress);
$("#geocoding_form").submit(showLocationByAddress);

function showLocationByAddress(e) {
  console.log("showlocationbyaddress called");
  e.preventDefault();

  // Getting the coordinates of the entered address
  GMaps.geocode({
    address: $("#address")
      .val()
      .trim(),
    callback: function(center, status) {
      console.log("callback function started");
      if (status !== "OK") {
        console.log("status !== ok");
        return;
      }
      console.log("status =" + status);

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("in place services");
        var latlng = center[0].geometry.location;
        initialLocation = latlng;
        var fullAddress = center[0].formatted_address;
        map = new GMaps({
          el: "#map",
          lat: latlng.lat(),
          lng: latlng.lng()
        });
        console.log("map: " + map);
        getPharmacies(map, initialLocation);
      }
      // end of callback()
    }
  });
}

function callback2(results, status) {
  console.log("results in callback2: " + results);
  console.log("results in callback2: " + results.length);
  for (var i = 0; i < results.length; i++) {
    console.log("result location: " + results[i].geometry.location);
    console.log("marker created");
    createMarker(results[i]);
  }
}

function getPharmacies(map, initialLocation) {
  console.log("inside getPharmacies");
  var request = {
    location: initialLocation,
    // 10 miles = 16,093 meters
    radius: 16093.4,
    type: "pharmacy"
  };
  console.log("map: " + map);
  var service = new google.maps.places.PlacesService(map);
  //service.nearbySearch(request, callback2);

  // var map = new GMaps({
  //   el: "#map",
  //   lat: latlng.lat(),
  //   lng: latlng.lng()
  // });
  // console.log("map reassigned: " + map);

  // Adding a marker on the wanted location
  // map.addMarker({
  //   lat: latlng.lat(),
  //   lng: latlng.lng()
  // });
  // end Gmaps.geocode
}

// var infowindow;

// function initMap() {
//   var location = { lat: 0, lng: 0 };

//   map = new google.maps.Map(document.getElementById("map"), {
//     center: location,
//     zoom: 1
//   });
//   infowindow = new google.maps.InfoWindow();
// }

function createMarker(place) {
  //console.log("place: " + place);
  //console.log("in create marker");
  var placeLoc = place.geometry.location;
  console.log("placeloc = " + placeLoc);
  // var marker = new google.maps.Marker({
  //   map: map,
  //   position: placeLoc
  // });
  map.addMarker({
    position: placeLoc
  });
  //console.log("marker: " + marker);

  // google.maps.event.addListener(marker, "click", function() {
  //   infowindow.setContent(place.name);
  //   infowindow.open(map, this);
  // });
}
