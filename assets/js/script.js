window.onload = function() {
  // $("#geocoding_form").submit(initMap);
  var address;
  var map;

  function initMap() {
    geocoder = new google.maps.Geocoder();
    var pyrmont = { lat: -33.866, lng: 151.196 };

    map = new google.maps.Map(document.getElementById("map"), {
      center: pyrmont,
      zoom: 17
    });

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: pyrmont,
        radius: 50000,
        type: ["pharmacy"]
      },
      processResults
    );
  }

  function codeAddress() {
    debugger;
    var address = document.getElementById("address").value;
    console.log(address);
    geocoder.geocode({ address: address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
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
    });
  }

  function processResults(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    } else {
      createMarkers(results);
    }
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

      placesList.innerHTML += "<li>" + place.name + "</li>";

      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  }
};
