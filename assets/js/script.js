var saveContainer = $(".save-container"),
  favoriteIcon = saveContainer.find(".glyphicon"),
  favoriteLocationsListGroup = $(".list-group");

var hasFavoriteLocations = false;

// Initialize a google maps using the gmaps library.
var map = new GMaps({
  el: "#map",
  lat: "0",
  lng: "0",
  zoom: 1
});

// Initialize the favorite locations array which is kept in localStorage

if (!localStorage.hasOwnProperty("favorite-locations")) {
  localStorage.setItem("favorite-locations", JSON.stringify([]));
}

hasFavoriteLocations = JSON.parse(localStorage.getItem("favorite-locations"))
  .length
  ? true
  : false;

// Form submit and Search icon handlers
$(".glyphicon-search").click(showLocationByAddress);
$("#geocoding_form").submit(showLocationByAddress);

// Click handler on any of the favorite locations
$(document).on("click", "a.list-group-item", showLocationByCoordinates);

// Click handler on the favorite(star) icon to become saved or removed
$(document).on("click", ".glyphicon-star", removeFavoriteLocation);
$(document).on("click", ".glyphicon-star-empty", saveFavoriteLocation);

if (hasFavoriteLocations) {
  var array = JSON.parse(localStorage.getItem("favorite-locations"));

  favoriteLocationsListGroup.empty();
  favoriteLocationsListGroup.append(
    '<span class="list-group-item active">Saved Locations</span>'
  );

  array.forEach(function(item) {
    favoriteLocationsListGroup.append(
      '<a class="list-group-item" data-lat="' +
        item.lat +
        '" data-lng="' +
        item.lng +
        '" data-createdAt="' +
        item.createdAt +
        '">' +
        item.address +
        '<span class="createdAt">' +
        moment(item.createdAt).fromNow() +
        '</span><span class="glyphicon glyphicon-menu-right"></span></a>'
    );
  });

  favoriteLocationsListGroup.show();
}

// This function presents the address which was entered in the text field in the map

function showLocationByAddress(e) {
  e.preventDefault();

  // Getting the coordinates of the entered address

  GMaps.geocode({
    address: $("#address")
      .val()
      .trim(),
    callback: function(results, status) {
      if (status !== "OK") return;

      var latlng = results[0].geometry.location,
        fullAddress = results[0].formatted_address,
        isLocationFavorite = false,
        locationsArray = JSON.parse(localStorage.getItem("favorite-locations")),
        saveLocation = $("#save-location");

      var map = new GMaps({
        el: "#map",
        lat: latlng.lat(),
        lng: latlng.lng()
      });

      // Adding a marker on the wanted location

      map.addMarker({
        lat: latlng.lat(),
        lng: latlng.lng()
      });

      // Checking if this address exists in the favorites array

      if (locationsArray.length) {
        locationsArray.forEach(function(item) {
          if (item.lat == latlng.lat() && item.lng == latlng.lng()) {
            isLocationFavorite = true;
          }
        });
      }

      // Adding the address to the html and setting data attributes with the coordinates
      saveLocation
        .text(fullAddress)
        .attr({ "data-lat": latlng.lat(), "data-lng": latlng.lng() });

      // Removing the active class from all favorite locations
      favoriteLocationsListGroup
        .find("a.list-group-item")
        .removeClass("active-location");

      // Changing the icon to become non-favorite

      if (!isLocationFavorite) {
        favoriteIcon
          .removeClass("glyphicon-star")
          .addClass("glyphicon-star-empty");
      } else {
        // Adding the active class and add the favorite icon on the given favorite location
        favoriteIcon
          .removeClass("glyphicon-star-empty")
          .addClass("glyphicon-star");

        // Find the entry in the favorite locations list that corresponds
        // to the current location, and mark it as active.

        favoriteLocationsListGroup
          .find(
            'a.list-group-item[data-lat="' +
              latlng.lat() +
              '"][data-lng="' +
              latlng.lng() +
              '"]'
          )
          .addClass("active-location");
      }

      // Show the html of the given location
      saveContainer.show();
    }
  });
}

// This function saves a location to favorites and adds it to localStorage

function saveFavoriteLocation(e) {
  e.preventDefault();

  var saveLocation = $("#save-location"),
    locationAddress = saveLocation.text(),
    isLocationFavorite = false,
    locationsArray = JSON.parse(localStorage.getItem("favorite-locations"));

  var location = {
    lat: saveLocation.attr("data-lat"),
    lng: saveLocation.attr("data-lng"),
    createdAt: moment().format()
  };

  // Checking if this location is in the favorites array

  if (locationsArray.length) {
    locationsArray.forEach(function(item) {
      if (item.lat == location.lat && item.lng == location.lng) {
        isLocationFavorite = true;
      }
    });
  }

  // If the given location is not in favorites,
  // add it to the HTML and to localStorage's array

  if (!isLocationFavorite) {
    favoriteLocationsListGroup.append(
      '<a class="list-group-item active-location" data-lat="' +
        location.lat +
        '" data-lng="' +
        location.lng +
        '" data-createdAt="' +
        location.createdAt +
        '">' +
        locationAddress +
        '<span class="createdAt">' +
        moment(location.createdAt).fromNow() +
        "</span>" +
        '<span class="glyphicon glyphicon-menu-right"></span>' +
        "</span></a>"
    );

    favoriteLocationsListGroup.show();

    // Adding the given location to the localStorage's array
    locationsArray.push({
      address: locationAddress,
      lat: location.lat,
      lng: location.lng,
      createdAt: moment().format()
    });

    localStorage.setItem("favorite-locations", JSON.stringify(locationsArray));

    // Make the star icon full, to signify that this location is now favorite
    favoriteIcon.removeClass("glyphicon-star-empty").addClass("glyphicon-star");

    // Now we have at least one favorite location
    hasFavoriteLocations = true;
  }
}