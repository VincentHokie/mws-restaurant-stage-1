import { fillRestaurantsHTML } from './htmlHelper'
import { fetchRestaurants } from './dbhelper'

// import { populateSingleConversionHTML, populateDoubleConversionHTML } from "./dom-manipulation";
// import iziToast from "izitoast";
// import * as theDom from "./dom-elements";

/*
    All the interactions that concern the indexDB come from and are
    written in this file
*/

/*
    Ensure we're testing every major browser
    i.e Chrome, Mozilla, Safari, IE
*/
window._indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/*
    Check if indexDB is supported, if not
    exit from the script/ give the user a useful message
*/
if (!window._indexedDB)
    showError("Your browser doesn't support a stable version of IndexedDB. The site will therefore not be available offline :(");


const hash = require('object-hash');
const DB_VERSION = 1;
const DB_NAME = "nanodegree_restaurant";
export const request = _indexedDB.open(DB_NAME, DB_VERSION);


/*
    Generic error handler for all errors targeted at this database's
    requests!
*/
request.onerror = (event) => {
    showError(`Database error: ${event.target.errorCode}`);
};

/*
    when the version number is updated, the `request.onupgradeneeded`
     function will be triggered and a new action could be run
     under the switch statement
*/
export const indexDBSetup = (request, main=true) => {
    
    request.onupgradeneeded = (event) => {
        let db = event.target.result;
        
        switch(DB_VERSION) {
            case 1: {
                db.createObjectStore("restaurants", { keyPath: "id" });
                db.createObjectStore("metadata", {});
            }
            break;
        }
    };
    if(main)
        fetchRestaurants(); //api call for restaurants
}

/*
    used to get restaurants from indexDB in the case
    the request on the network fails for some reason
*/
export const getRestaurants_indexdb = (request) => {
    
    let db = request.result;
    return db
        .transaction("restaurants", "readwrite")
        .objectStore("restaurants")
        .getAll();

}


/*
    used to get a restaurant from indexDB
*/
export const getRestaurantsById_indexdb = (request, id) => {
    
    let db = null;
    
    request.onsuccess = (event) => {
        db = event.target.result
        console.log(db)
        return db
            .transaction("restaurants", "readwrite")
            .objectStore("restaurants")
            .get(id);
    }

    // if(!db) return false

}


/*
    update the restaurants (ideally) in the case when the hash of all
    the restaurants retrieved is different. The hash is stored in indexDB
    under a different object store.
*/
let updateRestaurants = (restaurants, db, metaObjectStore) => {

    let restaurantObjectStore = db
        .transaction("restaurants", "readwrite")
        .objectStore("restaurants");

    // Store values in the newly created objectStore.
    for (let [key, value] of Object.entries(restaurants))
        restaurantObjectStore.put(value);

    metaObjectStore.put(hash(restaurants), "restaurants_hash");
    fillRestaurantsHTML(restaurants);
}


/*
    add the countries from the network into indexDB
    for use when in offline mode
*/
export const populateRestaurants = (request, restaurants) => {

    let db = request.target;
    request.onsuccess = (event) => {
        db = event.target.result;

        let metaObjectStore = db
        .transaction("metadata", "readwrite")
        .objectStore("metadata");

        let theHash = metaObjectStore
            .get('restaurants_hash');

        // toDo: if the hash of the countries are the same, do not
        // update the DB, the values will be exactly the same
        theHash.onsuccess = (event) => {
            if(!theHash.result || theHash.result != hash(restaurants)){
                updateRestaurants(restaurants, db, metaObjectStore);
            }
        };
    }
    

    if (!db){
        fillRestaurantsHTML(restaurants);
    }
}
