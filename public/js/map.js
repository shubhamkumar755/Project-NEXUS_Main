mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style:"mapbox://styles/mapbox/streets-v12",
center: listing.geometry.coordinates, // starting position [longtitude, lat]
zoom: 16 // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4><p>Excat location will be provided after booking`))
.addTo(map);

//environmental variables can be accessed by ejs 