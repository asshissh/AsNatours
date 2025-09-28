/* eslint-disable */
export const displayMap = locations => {
  console.log('Initializing map with locations:', locations);

  // Check if locations exist
  if (!locations || locations.length === 0) {
    console.error('No locations provided');
    return;
  }

  // Initialize Leaflet map
  const map = L.map('map', {
    scrollWheelZoom: false
  });

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Create bounds to fit all markers
  const group = new L.featureGroup();

  locations.forEach((loc, index) => {
    console.log(`Adding location ${index}:`, loc);
    
    // Validate coordinates
    if (!loc.coordinates || loc.coordinates.length < 2) {
      console.error(`Invalid coordinates for location ${index}`);
      return;
    }

    const lat = loc.coordinates[1];
    const lng = loc.coordinates[0];

    // Create custom marker using your existing CSS class
    const customIcon = L.divIcon({
      className: 'marker', // This matches your CSS class
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    // Add popup - Leaflet popups will automatically get styled
    marker.bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      maxWidth: 250, // Match your CSS max-width: 25rem
      className: 'leaflet-popup-custom' // Custom class for additional styling if needed
    });
    
    // Add marker to map and group
    marker.addTo(map);
    group.addLayer(marker);
  });

  // Fit map to show all markers with padding
  if (group.getLayers().length > 0) {
    map.fitBounds(group.getBounds().pad(0.1));
    console.log('Map bounds fitted successfully');
  } else {
    console.error('No markers added to map');
  }
};