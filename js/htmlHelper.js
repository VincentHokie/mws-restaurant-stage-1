/**
 * Common html helper functions.
 */
class HTMLHelper {

  /**
  * @description create a responsive image <figure> element
  * @param {className} the class given to the img tag
  * @param {restaurant} object with attributes to be used inside our markup
  * @returns {figure} html element with responsive features
  */
  static responsiveFigureElement(className, restaurant) {
    
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
    let imgUrl = DBHelper.imageUrlForRestaurant(restaurant);

    src800.media = '(min-width: 800px)';
    src800.srcset = imgUrl.replace('.jpg', '-800.jpg');

    src500.media = '(min-width: 500px)';
    src500.srcset = imgUrl.replace('.jpg', '-500.jpg');

    image.className = className;
    image.src = imgUrl.replace('.jpg', '-300.jpg');
    image.tabIndex = 0;
    image.alt = restaurant.alternate;

    picture.append(src800);
    picture.append(src500);
    picture.append(image);

    figure.append(picture);

    return figure;
    
  }

}

