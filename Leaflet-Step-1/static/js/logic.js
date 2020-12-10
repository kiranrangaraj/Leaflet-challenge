// Step 1:  Basic Visualization

//  API key for Mapbox
var apiKey = "pk.eyJ1Ijoia3JhbmdhcmFqIiwiYSI6ImNrZnExOGF1azA0ZWUyem13Z2I4eXl3bm0ifQ.Des8-3h8tvcznNQY06efSg";

// Create the tile layer for the map background
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: apiKey
});

// Create the map object with options
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Create the 'graymap' tile layer
graymap.addTo(map);

// Retrieve earthquake geoJSON data by making an AJAX call
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  
  // Create a function to return style data based on magnitude for each of the earthquakes plotted on the map
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // Function to determine color of the marker based on the earthquake magnitude
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // Function to determine radius of the marker based on the earthquake magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Create a GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
    // Return each feature as a circleMarker on the map
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Use a styleInfo function to set the circleMarker style
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location
    // of each earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  // Add to map
  }).addTo(map);

  // Create a legend control object
  var legend = L.control({
    position: "bottomright"
  });
  // Add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    // Create a loop to generate a labels with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Add legend to the map
  legend.addTo(map);
});