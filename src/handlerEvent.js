import AddRecipe from './addRecipe'


class controler{

    handlerEvnet(){
        return AddRecipe.addRecipeFrom();
    }

}

export default new controler()