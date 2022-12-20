export const autoCompleteOptions = (center: google.maps.LatLngLiteral) => {
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  }
  return {
    bounds: defaultBounds,
    componentRestrictions: { country: ['AU'] },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    types: ['establishment'],
  }
}

export const mapsOptions = () => {
  return {
    mapTypeId: 'satellite',
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    clickableIcons: false,
    isFractionalZoomEnabled: true,
    noClear: true,
    rotateControl: true,
  }
}
