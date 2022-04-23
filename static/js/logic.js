// Creating the map object
var myMap = L.map("map", {
    center: [40.75, -111.87],
    zoom: 4,
  });
  
  // Adding the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);
  
  function getradius(mag) {
    if (mag > 4) {
      return 35;
    } else if (mag >= 3) {
      return 15;
    } else if (mag >= 2) {
      return 10;
    } else {
      return 5;
    }
  }
  function getcolor(depth) {
    if (depth > 90) {
      return "black";
    } else if (depth > 70) {
      return "purple";
    } else if (depth > 50) {
      return "red";
    } else if (depth > 30) {
      return "orange";
    } else if (depth > 10) {
      return "yellow";
    } else {
      return "green";
    }
  }
  function getstyle(feature) {
    return {
      color: "white",
      fillOpacity: 0.7,
      radius: getradius(feature.properties.mag),
      fillColor: getcolor([feature.geometry.coordinates[2]]),
      weight: 1.5,
    };
  }
  // Getting our GeoJSON data
  d3.json(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  ).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    console.log(data);
    L.geoJson(data, {
      pointToLayer: (feature, coord) => {
        return L.circleMarker(coord);
      },
      style: getstyle,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<h3> ${
          feature.properties.place
        } </h3><b>Magnitude:</b> ${feature.properties.mag}
        <br /><b>Depth:</b> ${[feature.geometry.coordinates[2]]}`);
      },
    }).addTo(myMap);
  
  
    //  Set up the legend.
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend');
     labels = ['<strong>Earthquake Depth Range</strong>'],
     depth = [90,70,50,30,10,0];
    for (var i = 0; i < depth.length; i++) {
  
            div.innerHTML +=
            labels.push(
                '<i style="background:' + getcolor(depth[i]+1) + '"></i> ' +
                 (depth[i] ? depth[i] + '<br>': '+'));
                 div.innerHTML = labels.join('<br>');
  
   }
    return div;
   }
  
  legend.addTo(myMap);
  });