const markerTitle = "UNGS - Universidad Nacional de General Samiento";
const latlngs = [[-34.541, -58.773],[-34.486, -58.773],[-34.484, -58.653],[-34.541, -58.655]];

//initialices view on UNGS
const map = L.map('map').setView([-34.52211, -58.70059], 16);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: ''
	}).addTo(map);

	

	//Draggable marker
	const marker = L.marker([-34.52211, -58.70059],{
		draggable:"true",
		title:markerTitle,}

	).addTo(map)
		.bindPopup(markerTitle)
		.openPopup();

	console.log(marker.getLatLng())

	

	let polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);