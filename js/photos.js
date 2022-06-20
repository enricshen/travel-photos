mapboxgl.accessToken = 'pk.eyJ1IjoiZW5yaWNzaGVuIiwiYSI6ImNrdmluMzh2cjBkaGYyb3BrbGRkdGlmbDMifQ.zxH5mH0AlRmPPjSRQAbMYg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [176.8, -38.0],
    zoom: 9
});

map.on('load', function() {
    // Add a new source from our GeoJSON data and set the
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource("photos", {
        type: "geojson",
        // Point to GeoJSON data.

        data: "https://raw.githubusercontent.com/enricshen/travel-photos/master/data/photos.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "photos",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * black, 20px circles when point count is less than 10
            //   * orange, 30px circles when point count is between 10 and 20
            //   * dark red, 40px circles when point count is greater than or equal to 20
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#272838",
                10,
                "#CC9751",
                20,
                "#8E443D"
            ],
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                10,
                30,
                20,
                40
            ]
        }
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "photos",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 20
        },
        paint: {
            "text-color": "#fcf7f7"
        }
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "photos",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#525151",
            "circle-radius": 7,
            "circle-stroke-width": 1.2,
            "circle-stroke-color": "#fff"
        }
    });

    // Click on a cluster
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('photos').getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err)
                return;

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });

// Click on a point
//When a click event occurs on a feature (id=unclustered-point) in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'unclustered-point', function (e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var description = "<strong>"+e.features[0].properties.name +"</strong>"+
                  "<br>Open Objective Photo Below:" +
                  "<br><a href=\""+ e.features[0].properties.url+ "\" target=\"_blank\" title=\"Opens in a new window\">" + "<img src=\"" +e.features[0].properties.url+ "\" width=\”220\” height=\"110\"/>" + "</a>" +
                  "<br><strong>Date taken: </strong>"+e.features[0].properties.fileCreatedDate +
                  "<br><strong>Uploaded by: </strong>"+e.features[0].properties.owner

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}

// call to set the image
setImage(e.features[0].properties);

//new mapboxgl.Popup()
//.setLngLat(coordinates)
//.setHTML(description)
//.addTo(map);
});

//Control mouse movement
map.on('mouseenter', 'clusters', function () {
  map.getCanvas().style.cursor = 'pointer';
    });
map.on('mouseleave', 'clusters', function () {
  map.getCanvas().style.cursor = '';
    });

map.on('mouseenter', 'unclustered-point', function () {
  map.getCanvas().style.cursor = 'pointer';
    });
map.on('mouseleave', 'unclustered-point', function () {
  map.getCanvas().style.cursor = '';
    });
});

//Add geocoder
map.addControl(new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
}));
