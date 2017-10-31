var address;
var map;
var geocoder;
var marker;
var service;
var markers = [];

function initMap() {
  geocoder = new google.maps.Geocoder();
  var world = { lat: -0, lng: 0 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: world,
    zoom: 1
  });
  codeAddress;
}

function codeAddress() {
  var address = document.getElementById("address").value;

  geocoder.geocode({ address: address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);

      // marker
      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        draggable: true
      });

      google.maps.event.addListener(marker, "dragend", function() {
        document.getElementById("lat").value = marker.getPosition().lat();
        document.getElementById("lng").value = marker.getPosition().lng();
      });
      document.getElementById("lat").value = marker.getPosition().lat();
      document.getElementById("lng").value = marker.getPosition().lng();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }

    // find nearby places
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: results[0].geometry.location,
        radius: 50000,
        type: ["pharmacy"],
        viewport: results[0].geometry.LatLngBounds,
        bounds: results[0].geometry.LatLngBounds
      },
      processResults
    );
  });
}

function processResults(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);
  }
}

function addInfoWindow(marker, content) {
  marker.infoWindow = new google.maps.InfoWindow({
    content: content
  });
  google.maps.event.addListener(marker, "click", function() {
    marker.infoWindow.open(map, marker);
  });
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById("places");

  for (var i = 0, place; (place = places[i]); i++) {
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location
    });
    markers.push(marker);

    placesList.innerHTML += "<li>" + place.name + "</li>";

    addInfoWindow(marker, place.name);
    bounds.extend(place.geometry.location);
  }

  map.fitBounds(bounds);
}

initMap;
