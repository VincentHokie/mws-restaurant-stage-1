import { populateRestaurants, request, getRestaurants_indexdb } from './indexdb'
import L from 'leaflet'

/**
 * Common database helper functions.
 */

/**
 * Database URL.
 * Change this to restaurants.json file location on your server.
 */
const DATABASE_URL = () => {
  const port = '1337' // Change this to your server port
  return `http://localhost:${port}`;
}

/**
 * Fetch all restaurants.
 */
export const fetchRestaurants = (callback) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${DATABASE_URL()}/restaurants`);
  xhr.onload = () => {
    if (xhr.status === 200) { // Got a success response from server!
      const restaurants = JSON.parse(xhr.responseText);
      populateRestaurants(request, restaurants);
    } else { // Oops!. Got an error from server.
      populateRestaurants(request, getRestaurants_indexdb());
    }
  };
  xhr.send();
}

/**
 * Fetch a restaurant by its ID.
 */
export const fetchRestaurantById = (id, callback) => {
  // fetch all restaurants with proper error handling.
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${DATABASE_URL()}/restaurants/${id}`);
  xhr.onload = () => {
    if (xhr.status === 200) { // Got the restaurant
      const restaurant = JSON.parse(xhr.responseText);
      callback(null, restaurant);
    } else { // Restaurant does not exist in the database
      callback('Restaurant does not exist', null);
    }
  };
  xhr.send();
}

/**
 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
 */
export const filterRestaurantByCuisineAndNeighborhood = (cuisine, neighborhood, callback) => {
  // Fetch all restaurants
  const restaurants = document.getElementsByClassName("restaurant-article");
  console.log(cuisine, neighborhood)
  for(const restaurant of restaurants){

    restaurant.style.display = "block"
    if (cuisine != 'all') // filter by cuisine
      restaurant.classList.contains(cuisine) ? 
        restaurant.style.display = "block" : restaurant.style.display = "none" ;
    
    if (neighborhood != 'all' && restaurant.style.display != "none") // filter by neighborhood
      restaurant.classList.contains(neighborhood) ? 
        restaurant.style.display = "block" : restaurant.style.display = "none" ;
    
  }

}


/**
 * Restaurant page URL.
 */
export const urlForRestaurant = (restaurant) => {
  return (`./restaurant.html?id=${restaurant.id}`);
}

/**
 * Restaurant image URL.
 */
export const imageUrlForRestaurant = (restaurant) => {
  return (`images-resp/${restaurant.photograph}`);
}

/**
 * Map marker for a restaurant.
 */
  export const mapMarkerForRestaurant = (restaurant, map) => {
  // https://leafletjs.com/reference-1.3.0.html#marker  
  const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
    {title: restaurant.name,
    alt: restaurant.name,
    url: urlForRestaurant(restaurant)
    })
    marker.addTo(newMap);
  return marker;
} 
