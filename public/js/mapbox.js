const map = document.querySelector('#map')
const locations = map && JSON.parse(map.dataset.locations)
if (locations) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jvc3Nyb2FkMCIsImEiOiJjazUxMmxpZmYwcWN5M21zYWVjeGp3Y2R2In0.uGWsjkGK8NBw8tuADuqAgA'
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/crossroad0/ck8kb3ups08u01ip0nj7tr6wi',
  })
  
  const bounds = new mapboxgl.LngLatBounds()
  locations.forEach(location => {
    const el = document.createElement('div')
    el.classList.add('marker')
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
      scrollZoom: false,
    }).setLngLat(location.coordinates).addTo(map)
  
    new mapboxgl.Popup({
      offset: 30,
    }).setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map)
  
    bounds.extend(location.coordinates)
  })
  
  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100,
    }
  })
}
