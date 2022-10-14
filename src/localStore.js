import { async } from "regenerator-runtime";
import { RemoverenderData, renderData } from "./domAction";
import  Entity from "./index";

// Set Data //
export async function sendItemToStore(boxName,data){
   return  localStorage.setItem(boxName, JSON.stringify(data));
 }



export function Assingindetifer(){
   return Math.random()+''
}


 //Get any Item From Local Store//
 export async function getItemFromStore(item){
    console.log(item)
    return JSON.parse(localStorage.getItem(item))
}

export async function sendFrom(fromThis, dom){
   const dataFrom = [...new FormData(fromThis)];
   console.log(dataFrom)
   const data = Object.fromEntries(dataFrom)
   let objRecipe = {id_Recipie:  Assingindetifer()}

   for (const value in data) {
      if(data[value]==='') return Entity._showError('Yuo have to complte All', '408', Entity._getCurrentTIme());
       objRecipe[value] = data[value]
   }
    objRecipe.Ingredientes =  objRecipe.Ingredientes.trim().split('\n');

    console.log(objRecipe);

    Entity.myRecipiesStore.push(objRecipe)
    renderData(dom)

    await sendItemToStore('My Recipies',Entity.myRecipiesStore);
    RemoverenderData(dom)

    const child = document.querySelector('.info_from')
    const children = [...child.childNodes].forEach(nodeText => nodeText.value= '')

}



/**
 * 
 * 
 */