import { indexDBSetup, request } from './indexdb'
import { fillRestaurantsHTML } from './htmlHelper'
import { mapMarkerForRestaurant, filterRestaurantByCuisineAndNeighborhood } from './dbhelper'
import L from 'leaflet'

let restaurants,
  neighborhoods,
  cuisines
var newMap


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  indexDBSetup(request);
});

const cuisinesSelect = document.getElementById("cuisines-select");
const neighborhoodsSelect = document.getElementById("neighborhoods-select");

/**
 * Register the sw
 */
export const registerSW = () => {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then((reg) => {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch((error) => {
        // registration failed
        console.log('Registration failed with ' + error);
    });
  }

}

registerSW();


/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = () => {
  // Remove all restaurants
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (markers) {
    markers.forEach(marker => marker.remove());
  }
  markers = [];
  
}

/**
 * Update page and map for current restaurants.
 */
const filterRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  filterRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants();
      fillRestaurantsHTML(restaurants);
    }
  })
}

cuisinesSelect ? cuisinesSelect.addEventListener("change", filterRestaurants) : null;
neighborhoodsSelect ? neighborhoodsSelect.addEventListener("change", filterRestaurants) : null;

/**
 * Initialize leaflet map, called from HTML.
 */
const initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoidmluY2UxMjMiLCJhIjoiY2prcXN3NXN1MW9rbjNwcXJueHpyc2dmZSJ9.YsyXvOQkxa4064Cr4-OiRg',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(self.newMap);

  // filterRestaurants();
}


/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */
