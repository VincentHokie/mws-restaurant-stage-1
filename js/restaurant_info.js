import { responsiveFigureElement } from './htmlHelper'
import { 
  mapMarkerForRestaurant,
  fetchRestaurantById } from './dbhelper'
import { request, indexDBSetup, getRestaurantsById_indexdb } from './indexdb'
import { registerSW } from './main'
import L from 'leaflet'

let restaurant;
var newDetailMap;

registerSW();

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.tabIndex = 0;

  const image = document.getElementById('restaurant-img');
  let figure = responsiveFigureElement('', restaurant);
  figure.children[0].lastChild.id = 'restaurant-img';
  image.replaceWith(figure);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML(restaurant.operating_hours);
  }
  // fill reviews
  fillReviewsHTML(restaurant.reviews);
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (request, callback) => {
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } 
  
  let restaurant = getRestaurantsById_indexdb(request, id);
  /* 
  * if we get a restaurant back, use that, otherwise
  * hit the network
  */
  restaurant ? fillRestaurantHTML(restaurant) :
  fetchRestaurantById(id, (error, restaurant) => {
    if (!restaurant) {
      console.error(error);
      return;
    }
    fillRestaurantHTML(restaurant);
    callback(null, restaurant)
  });
}

/**
 * Initialize leaflet map
 */
const initMap = () => {
  
  fetchRestaurantFromURL(request, (error, restaurant) => {
    
    if (error) { // Got an error!
      console.error(error);
    } else {
      if(newMap) newMap.remove();
      newDetailMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoidmluY2UxMjMiLCJhIjoiY2prcXN3NXN1MW9rbjNwcXJueHpyc2dmZSJ9.YsyXvOQkxa4064Cr4-OiRg',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newDetailMap);
      fillBreadcrumb(restaurant);
      mapMarkerForRestaurant(restaurant, newDetailMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */


/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
  indexDBSetup(request);
});


/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours) => {
  
  const hours = document.getElementById('restaurant-hours');
  const title = document.createElement('h2');
  title.innerHTML = 'Opening Hours';
  title.tabIndex = 0;
  hours.appendChild(title);
  
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.tabIndex = 0;
    
    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');

    /* 
    * change all hyphens to read 'to' for the benefit
    * of screenreaders and the users that need them
    */
    time.innerHTML = operatingHours[key].replace(/-/g, 'to');
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  title.tabIndex = 0;
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const div = document.getElementById('reviews-list');
  reviews.forEach(review => {
    div.appendChild(createReviewHTML(review));
  });
  container.appendChild(div);
}

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const article = document.createElement('article');
  const name = document.createElement('p');
  name.innerHTML = `${review.name},`;
  article.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = `${review.date},`;
  article.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating},`;
  article.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = `${review.comments}.`;
  article.appendChild(comments);

  article.tabIndex = 0;
  return article;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
