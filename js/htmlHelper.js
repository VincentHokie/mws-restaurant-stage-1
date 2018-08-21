import { imageUrlForRestaurant, urlForRestaurant, mapMarkerForRestaurant, getRestaurants_indexdb } from './dbhelper'

/**
 * Common html helper functions.
 */

/**
* @description create a responsive image <figure> element
* @param {className} the class given to the img tag
* @param {restaurant} object with attributes to be used inside our markup
* @returns {figure} html element with responsive features
*/
export const responsiveFigureElement = (className, restaurant) => {
  
  /*
  * create responsive image markup i.e.
  * 
  * <figure>
  *   <picture>
  *     <source media='' srcset='' />
  *     <source media='' srcset='' />
  *     <img src='' alt='' >
  *   </picture>
  * </figure>
  * 
  * */
  const figure = document.createElement('figure');
  const picture = document.createElement('picture');
  const src800 = document.createElement('source');
  const src500 = document.createElement('source');
  const image = document.createElement('img');
  let imgUrl = imageUrlForRestaurant(restaurant);

  src800.media = '(min-width: 800px)';
  src800.srcset = `${imgUrl}-800.jpg`;

  src500.media = '(min-width: 500px)';
  src500.srcset = `${imgUrl}-500.jpg`;

  image.className = className;
  image.src = `${imgUrl}-300.jpg`;
  image.tabIndex = 0;
  image.alt = restaurant.alternate;

  picture.append(src800);
  picture.append(src500);
  picture.append(image);

  figure.append(picture);

  return figure;
  
}


/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants) => {
  restaurants.forEach(restaurant => {
    // // Add marker to the map
    // const marker = mapMarkerForRestaurant(restaurant, newMap);
    // marker.on("click", onClick);
    // function onClick() {
    //   window.location.href = marker.options.url;
    // }
    // self.markers.push(marker);
  });

}


 /**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  const article = document.createElement('article');
  article.className = `${restaurant.neighborhood} ${restaurant.cuisine_type} restaurant-article`
  article.append(responsiveFigureElement('restaurant-img', restaurant));

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  article.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  article.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  article.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = urlForRestaurant(restaurant);
  article.append(more)

  return article 
}


/**
 * Set neighborhoods HTML.
 */
export const fillNeighborhoodsHTML = (restaurants) => {

  let neighborhoods = new Set()
  const select = document.getElementById('neighborhoods-select');
  select.innerHTML = `<option value="all">All Neighborhoods</option>`;

  restaurants.forEach((restaurant) => {
    if(!neighborhoods.has(restaurant.neighborhood)){
      let hood = restaurant.neighborhood;
      neighborhoods.add(hood)
      const option = document.createElement('option');
      option.innerHTML = hood;
      option.value = hood;
      select.append(option);
    }
    

  });

}


/**
 * Set cuisines HTML.
 */
export const fillCuisinesHTML = (restaurants) => {

  let cuisines = new Set()
  const select = document.getElementById('cuisines-select');
  select.innerHTML = `<option value="all">All Cuisines</option>`;

  restaurants.forEach((restaurant) => {
    if(!cuisines.has(restaurant.cuisine_type)){
      let cuisine = restaurant.cuisine_type;
      cuisines.add(cuisine)
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    }
    

  });

}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
export const fillRestaurantsHTML = (restaurants) => {
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = "";

  fillCuisinesHTML(restaurants);
  fillNeighborhoodsHTML(restaurants);
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap(restaurants);
}
