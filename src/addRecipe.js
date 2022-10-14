import { _removeChildrens } from './domAction.js'

class AddRecipe{
    
 addRecipeFrom(){
    return `
    <div class="fromRecipie">
    <div class="close"><spam class="claseW">x</spam></div>
    <form action="/">
    <div class="title">
      <i class="fas fa-pencil-alt"></i> 
      <h2>Register Recipie here</h2>
    </div>
    <div class="info_from">
    <input class="fname" type="text" name="name" placeholder="Full name Recipe">
    <input type="text" name="yeild" placeholder="yeild">
    <input type="text" name="calories" placeholder="calories">
    <input type="text" name="Location" placeholder="Location">
    <input type="text" name="MealType" placeholder="MealType">
    <input type="text" name="imgUrk" placeholder="Recipe IMG">
      <h3>Ingredients</h3>
      <textarea name="Ingredientes" id="textBoxIngrediente" cols="60" rows="20" placeholder="Ingredientes"></textarea>
    </div>
    <div class="checkbox">
      <input type="checkbox" name="checkbox"><span>I agree to the <a href="https://www.w3docs.com/privacy-policy">Privacy Poalicy for W3Docs.</a></span>
    </div>
    <button type="submit" href="/">Submit</button>
      </form>
     </div>
      `;
    }
}

export default new AddRecipe() 