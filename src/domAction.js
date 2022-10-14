

// Public Variable //
export const TypeLocationAvaible = [
    { nm: "American", item: "🌎" },
    { nm: "Asian", item: "🌏" },
    { nm: "British", item: "🌍" },
    { nm: "Caribbean", item: "🌎" },
    { nm: "Cantral Europe", item: "🌍" },
    { nm: "Chinese", item: "🌏" },
    { nm: "Eastern Europe", item: "🌍" },
    { nm: "French", item: "🌍" },
    { nm: "Indian", item: "🌏" },
    { nm: "Italian", item: "🌍" },
    { nm: "Japanese", item: "🌏" },
    { nm: "Kosher", item: "🌏" },
    { nm: "Mediterranean", item: "🌍" },
    { nm: "Mexican", item: "🌎" },
    { nm: "Middle Eastern", item: "🌎" },
    { nm: "South American", item: "🌎" },
    { nm: "South East Asian", item: "🌏" },
 ];


 // animation DOM
export function createCuisineType(typeCuisine){
    let getter = TypeLocationAvaible.find(element => element.nm.toLocaleLowerCase() === typeCuisine.toLocaleLowerCase());
    let cusineLocation = `${getter.nm.slice(0,1).toLocaleUpperCase()+getter.nm.slice(1)}  ${getter.item}`;
    return cusineLocation;
  }

export function _generateCalories(yeild, calories){
  console.log(yeild)
 return Math.floor(Number(calories)/ yeild);
}


// remove all childrens //
export function  _removeChildrens(parent){
     while (parent.firstChild) {
         parent.removeChild(parent.lastChild);
       }
 }





// depending of caloria and people retrun calories..//
 export function _getCalories(calories, obj) {
    let yields = obj.yield
    return Math.floor(Number(calories) / yields);
 }

export function renderData(pattern){
  let loader = `<div class="box"></div>`
  pattern.insertAdjacentHTML("afterbegin", loader);
}

export function RemoverenderData(pattern){
  pattern.removeChild(document.querySelector('.box'));
}
