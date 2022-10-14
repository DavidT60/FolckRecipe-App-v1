'use strict'
import { createCuisineType, TypeLocationAvaible, _generateCalories, _getCalories,_removeChildrens, renderData, RemoverenderData } from "./domAction";
import {sendItemToStore, getItemFromStore, sendFrom} from './localStore';
import imgNosource from './img/nothing.png'
import 'core-js/stable'// polyfilling all
import 'regenerator-runtime/runtime' // polyfilling async
import controler from './handlerEvent'


//--- DOM SELECTIONED //
const errorUI = document.querySelector('.error');
const AllBoxes = document.querySelectorAll('.items_box');
const webBar = document.getElementById('observerUI');

const barNavegator = document.querySelector('.web-top');
const container = document.querySelector('.container');

const openSourceElement = document.querySelector('.recipe_d');
const reciperLoader = document.querySelector('.contenedor');

const search = document.querySelector('.buttonSearch');

const btnBack = document.querySelector('.backSource01');

const coloriasData = document.querySelector('.caoloriesNumber');

const webBarActionBts = document.querySelector('.web-barright2');

const getClassAlter = document.querySelector('.imgEmpety');

const addNeeFrom = document.getElementById('1838drw3_23e');

// Selection: 
const optionsSelection = document.getElementById("plan");
const inputSender = document.querySelector('.buttonSearch');
const btnSearch = document.querySelector('.searchIcon');



// Start App//
class Entity {
   dataRecipies;
   // Status if the user has a source opened or closed//
   log = !false;

   query;
   location;

   // Important actions //
   #currentOpenSource;
   #bookMarksStore = [];
   myRecipiesStore = [];


   // Get the basic inf of recipies //
   htmlFrom = [];

   constructor() {
      // First Call//
      this._getRequest();
      btnBack.addEventListener('click', this._openDomToggle.bind(this));
      container.addEventListener('click', this._ClickOpenSource.bind(this));
      webBarActionBts.addEventListener('click', this._sectionChange.bind(this));
  
       // Search actions //    
      inputSender.addEventListener('keydown', this._activeRequest.bind(this));
      btnSearch.addEventListener('click', this._CheckerRequest.bind(this));
      addNeeFrom.addEventListener('click', this._addNewRecipe.bind(this))
      
   }

      //Send the request//
   async _sendRequest(valueQuesry, valueLocation){
      renderData(container);
      let urlANVFILE = `https://api.edamam.com/api/recipes/v2?type=public&q=${valueQuesry}&app_id=43d62b20&app_key=6682d412a652d7552daa04a5df810b6d&ingr=10&diet=balanced&cuisineType=${valueLocation}&mealType=Dinner`
      let request = await fetch(urlANVFILE);
      let getJasonDat = await request.json();
      this.dataRecipies = getJasonDat; 

      
      // UI ONLOAD // //In this TImeline getJason Has the data //
      RemoverenderData(container);
      this._OnloadUI();

      if(!container.firstChild){
            let html = `<h3> NO FOUND :C</h3>`;
            container.insertAdjacentHTML('afterbegin', html);
      }
   }

   // when is typing in the input search //
   _activeRequest(e){
      if(e.code === "Enter"){
          this._CheckerRequest();
      }
   }

  
   // Checker inputs before call the event search/// inf:The event is always invoked when input or select change
   async _CheckerRequest(){
       this.location = optionsSelection.value;
       this.query = inputSender.value;
   

      if(this.query !==null && this.location !==null &&  inputSender.value !== ""){

        await this._sendRequest(this.query, this.location);
        inputSender.value = "";
     }
      
   }


   async _getRequest() {
      try {
         // If Already the user called the api then if will be false, the data the i need is in localStore//
         if(!await getItemFromStore('data')){
           renderData(container);// load animation
           let urlANVFILE = `https://api.edamam.com/api/recipes/v2?type=public&q=Mango&app_id=43d62b20&app_key=6682d412a652d7552daa04a5df810b6d&ingr=10&diet=balanced&cuisineType=American&mealType=Dinner`
           let request = await fetch(urlANVFILE);
           if(!request.ok) Error("Something went wrong sending the request.")
           let getJasonDat = await request.json();
           this.dataRecipies = getJasonDat;
           RemoverenderData(container);//load animation
           
           console.log("Set Data In localStore 📦");
           sendItemToStore('data', this.dataRecipies);
         }else{
           console.log("GET Data From localStore 📦");
           this.dataRecipies =  await getItemFromStore('data');
           
           // fill BookMarks //
         this.#bookMarksStore = await getItemFromStore('BookMarks')? await getItemFromStore('BookMarks') : [];
         this.myRecipiesStore = await getItemFromStore('My Recipies')? await getItemFromStore('My Recipies') : [];
           
         }
         
      } catch (e) {
         this._showError(e, e.message, this._getCurrentTIme());
      }

      // UI ONLOAD // //In this TImeline getJason Has the data //
      this._OnloadUI();
   }

   // Display The Current Date//
   _getCurrentTIme() {
      const date = new Date()
      return date.toLocaleTimeString();
   }


   // Handle all Error //
   _showError(error, detailsInf, time) {
      const messageError = document.querySelector('.messageError');
      errorUI.classList.remove('hiddenError');

      errorUI.addEventListener('click', () => {
         messageError.textContent = `Invoked Handler Error: ${error}, ${detailsInf}, ${time}  ⚠`;
      })

      setTimeout(()=>{
         errorUI.classList.add('hiddenError');
      },6000)

   }

   _strigConvertor(data) {
      return String(data);
   }


   
   // invocation auto, when the request id done//
   _OnloadUI() {

      _removeChildrens(container);
      TypeLocationAvaible.forEach((element, index, _,) => {
         let htmlCountriesSelecton = `<option id="${this._strigConvertor(Math.random() * index).split(".").join(' ')}" value="${element.nm}" class="options-S" >${element.nm}</option>`;
         optionsSelection.insertAdjacentHTML("afterbegin", htmlCountriesSelecton);
      });
      // Load Content //
      //Parts that we need from the API response..//
      
      const [...hitsData] = this.dataRecipies.hits//get the recipies Array

      hitsData.forEach((element) => {
         //pattern Contains The Data that will Displayed in UI //
         let pattern = {
            ////id_Recipie: It takes the id from the uri:string (element object), the id is in an url, so a take those number from the url////
            id_Recipie: element.recipe.uri.split("_")[1],
            imagen_url: element.recipe.image,
            label: element.recipe.label,
            authur: element.recipe.source,
            mealType: element.recipe.mealType,
            calories: element.recipe.calories,
            cautions: element.recipe.cautions,
            cuisineType: element.recipe.cuisineType,
            dishType: element.recipe.dishType,
            dietLabels: element.recipe.dietLabels,
            ingredientLines: element.recipe.ingredientLines,
            source: element.recipe.source,
            uri: element.recipe.uri,
            url: element.recipe.url,
            yield: element.recipe.yield
         }

         // inser HTML //
         const htmlFrom = `        
        <div class="items_box horizontal" id="${pattern.id_Recipie}">
          <img src="${pattern.imagen_url}" class="image_url" title="${pattern.label}">
          <div class="inf">
            <h4 class="title">${pattern.label}</h4>
            <span class="publisher">${pattern.authur}</span><span class="publisher_url">${pattern.mealType}</span>
         </div>
        </div>`;


         container.insertAdjacentHTML("afterbegin", htmlFrom);
         this.htmlFrom.push(pattern);

      });

   }

   _checker(){
      if(reciperLoader.firstChild ===  null){
         const html = 
         `<div class="imgEmpety hiddem">
             <img class="empety_box" src="${imgNosource}" alt="img"  title="img">
             <h1>You dont't have content</h1>
          </div>`  
          reciperLoader.insertAdjacentHTML('beforeend', html);
      }
    }


   // Open Dom Toogle set  hidden || display//
   _openDomToggle() {
      //already bind(this)
      const targets = document.querySelectorAll('.web-bar-item-button');
      targets.forEach(element => element.classList.remove("activer")); 
      optionsSelection.classList.add('activer');


      barNavegator.classList.toggle('hidden')
      container.classList.toggle('hidden')
      openSourceElement.classList.toggle('recipe_Show')
   

      this.log ? '': _removeChildrens(reciperLoader);
      this.log = !this.log;

   }


    // Remove a Recipe from the BooksMarkssorote array depening the id //
  async _removeBookMarks(id, from){
       let checkerData =  this.#bookMarksStore.some(element => element.id_Recipie === id)  
       let checkerData2 = this.myRecipiesStore.some(element => element.id_Recipie === id)


       if(checkerData===false && checkerData2===false)return this._showError("Something went wrong, you dont have this recipe saved", "789", this._getCurrentTIme());        
        
        if(from === 'BookMarks'){
            const copier = this.#bookMarksStore.filter(element => element.id_Recipie !== id);
            this.#bookMarksStore=copier;
         }
        
         if(from === 'My Recipies'){
           const copier = this.myRecipiesStore.filter(element => element.id_Recipie !== id);
           this.myRecipiesStore=copier;
         }
        
        const selectBtn = document.getElementsByName(id)[0];
        selectBtn.textContent = 'Save';
        selectBtn.classList.add('saveBtn');
        selectBtn.classList.remove("remuveBtn");
        _removeChildrens(reciperLoader)

        if(from==='BookMarks'){sendItemToStore(from,this.#bookMarksStore); this._loadBooksMarks(this.#bookMarksStore)}
        if(from === 'My Recipies'){sendItemToStore(from,this.myRecipiesStore); this._loadMyRecipies(this.myRecipiesStore)}
        
        this._checker();

   } 

   _addNewRecipe(){
       _removeChildrens(container);
       let html = controler.handlerEvnet();

       // App htmlFrom //
        container.insertAdjacentHTML('afterbegin', html)
        const closer = document.querySelector('.close');
         
        document.querySelector('form').addEventListener('submit', function(e){
           e.preventDefault();
            sendFrom(this, container);
        })

        closer.addEventListener('click', (e)=>{
          e.preventDefault();
          this._OnloadUI()
        })
   }


    // Window of BookMarks //
   _loadBooksMarks(gletteringContent){


      if(gletteringContent?.length === 0) return;
      reciperLoader.insertAdjacentHTML('beforeend', `<div class="bookMarksDOM"></div>`);
      let domBookMarks = document.querySelector('.bookMarksDOM');
       gletteringContent.forEach((element, index, _)=>{
         const htmlOpenSourceBook = `
               <div class="cover_img_div">
                     <img src="${element.imagen_url}" alt="${element.mealType}" title="JPG">
                     <div class="cover"> <h3 class="source_recipe_target">${element.label}</h3></div>
               </div>
               <div class="inf_recipie">
                     <div class="inft">
                        <button class="remuveBtn" name="${element.id_Recipie}">Remove</button>
                     </div>
                     <h3 class="from_location">${createCuisineType(element.cuisineType.join(' '))}</h3>
                     <div class="inf_ge">
                           <div class="yeid_config"><h3>Peoples:</h3><input type="number" name="@${element.id_Recipie}" value="${element.yield}" class="yeild" placeholder="Peoples"></div>
                           <h4 class="mealType">${element.mealType.join(' ')}</h4>
                           <h4 class="calories">calories: <span class="caoloriesNumber" id="caloriesid${element.id_Recipie}">${Math.floor(_getCalories(element.calories, element))}</span></h4>
                           <h4 class="dietLabels">${element.dietLabels.join(' ')}</h4> 
                           <h4 class="ingrdientes">Ingrdientes</h4>
                           <div class="ingrdientes">
                              <ul id="ingredientesData" class="ingre${element.id_Recipie}">
                              </ul>
                           </div>
                           <div class="sourceInf">
                              <span><a href="${element.uri}">Bon Appetit</a></span>
                              <span><a href="${element.url}">More Details</a></span>
                        </div>
                     </div>
               </div>
               <br>
               `;
               
               domBookMarks.insertAdjacentHTML('beforeend', htmlOpenSourceBook);
               const ingredientesData = document.querySelector(`.ingre${element.id_Recipie}`);
               element.ingredientLines.forEach(element => ingredientesData.insertAdjacentHTML('beforeend',`<li>${element}</li>`));


        });

         
        //  //
         domBookMarks.addEventListener('click', (e)=>{let tar = e.target.closest('.remuveBtn'); tar? this._removeBookMarks(tar.name, 'BookMarks'):false});
         domBookMarks.addEventListener('change', (e)=>{let tar = e.target.closest('.yeild'); tar? this._addNewYeild(tar, tar.name):false});

   }


        // Window of My BookMarks //
   _loadMyRecipies(gletteringContent){
      if(gletteringContent?.length === 0) return;
      reciperLoader.insertAdjacentHTML('beforeend', `<div class="bookMarksDOM"></div>`);
      let domBookMarks = document.querySelector('.bookMarksDOM');

      gletteringContent.forEach((element, index, _)=>{
         const htmlOpenSourceBook = `
               <div class="cover_img_div">
                     <img src="${element.imgUrk}" alt="${element.MealType}" title="JPG">
                     <div class="cover"> <h3 class="source_recipe_target">${element.name} © </h3></div>
               </div>
               <div class="inf_recipie">
                     <div class="inft">
                        <button class="remuveBtn" name="${element.id_Recipie}">Remove</button>
                     </div>
                     <h3 class="from_location">${element.Location}</h3>
                     <div class="inf_ge">
                           <div class="yeid_config"><h3>Peoples:</h3><input type="number" name="@${element.id_Recipie}" value="${element.yeild}" class="yeild" placeholder="Peoples"></div>
                           <h4 class="mealType">${element.MealType}</h4>
                           <h4 class="calories">calories: <span class="caoloriesNumber" id="caloriesid${element.id_Recipie}">${Math.floor(_getCalories(element.calories, {yield: element.yeild}))}</span></h4>
                           <h4 class="ingrdientes">Ingrdientes</h4>
                           <div class="ingrdientes">
                              <ul id="ingredientesData" class="ingre#${element.id_Recipie}">
                              </ul>
                           </div>
                     </div>
               </div>
               <br>
               `;


               
               domBookMarks.insertAdjacentHTML('beforeend', htmlOpenSourceBook);
               const ingredientesData = document.querySelector(`#ingredientesData`);
               element.Ingredientes.forEach(element => ingredientesData.insertAdjacentHTML('beforeend',`<li>${element}</li>`));

        });

         
        //  //
         domBookMarks.addEventListener('click', (e)=>{let tar = e.target.closest('.remuveBtn'); tar? this._removeBookMarks(tar.name, 'My Recipies'):false});
         domBookMarks.addEventListener('change', (e)=>{let tar = e.target.closest('.yeild'); tar? this._addNewYeild(tar, tar.name):false});

   }






   _addNewYeild(idTarget, id){
      let caloriesInputid = id.slice(1);
      let obj = this.#bookMarksStore.find(element => element.id_Recipie === caloriesInputid)  || this.myRecipiesStore.find(element => element.id_Recipie === caloriesInputid)
      if(obj) document.getElementById(`caloriesid${caloriesInputid}`).textContent = _generateCalories(document.getElementsByName(`@${caloriesInputid}`)[0].value, obj.calories);
   }


   // What Section is Open BookMarks or My Recipe //
  async _sectionChange(e){    
      const targets = document.querySelectorAll('.web-bar-item-button')
      targets.forEach(element => element.classList.remove("activer")); 
      const targetClicked = e.target.closest('.web-bar-item-button');
      targetClicked.classList.contains('activer')?  targetClicked.classList.add('activer'):targetClicked.classList.add('activer');
      if(targetClicked.id === 'plan') return;
      // if(targetClicked. = 'Plan') return; // it does call when selection is clicked.//
      this._openDomToggle();
      
      // Add  Content //
      if(targetClicked.textContent === 'BookMarks' || targetClicked.textContent === 'My Recipies'){
          if(getItemFromStore(targetClicked.textContent)? localStorage.getItem(targetClicked.textContent)?.length > 0 : false){
               // if does not have anything in box..//
              renderData(reciperLoader);
              let gletteringContent = await getItemFromStore(targetClicked.textContent);

              RemoverenderData(reciperLoader);

              _removeChildrens(reciperLoader);

              if(targetClicked.textContent === 'My Recipies') this._loadMyRecipies(gletteringContent);
              if(targetClicked.textContent === 'BookMarks')  this._loadBooksMarks(gletteringContent);

              this._checker();
              return;
          }

          this._checker();

      }
   } 

   // Save Book Marks//
   async _saveBookMaeks(e){
       let id = e.target.name;
       if(e.target.classList.contains('remuveBtn')){
         this._removeBookMarks(id, 'Soruce Windown')
         return;
        }

      // if it does not have class remueveBtn//
      let recipe = this.htmlFrom.find(element => element.id_Recipie === id);
      if(!recipe) this._showError("Something went wrong saving","234", this._getCurrentTIme());
      console.log(`Loading local sotore 📦 in ${id}`);
      this.#bookMarksStore.push(recipe)
      sendItemToStore('BookMarks',this.#bookMarksStore);
      document.getElementsByName(id)[0].classList.add('remuveBtn');
      document.getElementsByName(id)[0].textContent = 'Remove';
      
   }



   // Open source about recipe //
   _openSourceUI(idRecipie) {
   
      let openSource = this.htmlFrom.find(elementObjt => this._strigConvertor(elementObjt.id_Recipie) === this._strigConvertor(idRecipie));
      // Assing The current Opened Recipie //
      this.#currentOpenSource = openSource;
      let isOnBookMarkAlready = this.#bookMarksStore?this.#bookMarksStore.some(element => element.id_Recipie === openSource.id_Recipie) : false;

      const htmlOpenSource = `
         <div class="cover_img_div">
               <img src="${openSource.imagen_url}" alt="${openSource.mealType}" title="JPG">
               <div class="cover"> <h3 class="source_recipe_target">${openSource.label}</h3></div>
         </div>
         <div class="inf_recipie">
               <div class="inft">
                  <button class="${isOnBookMarkAlready? 'remuveBtn':'saveBtn'}" name="${openSource.id_Recipie}">${isOnBookMarkAlready? 'Remove':'Save'}</button>
               </div>
               <h3 class="from_location">${createCuisineType(openSource.cuisineType.join(' '))}</h3>
               <div class="inf_ge">
               <div class="yeid_config"><h3>Peoples:</h3><input type="number" name="@${openSource._Recipie}" value="${openSource.yield}" class="yeild" placeholder="Peoples"></div>
               <h4 class="mealType">${openSource.mealType.join(' ')}</h4>
                     <h4 class="calories">calories: <span class="caoloriesNumber" id="caloriesid${openSource.id_Recipie}">${Math.floor(_getCalories(openSource.calories, openSource))}</span></h4>
                     <h4 class="dietLabels">${openSource.dietLabels.join(' ')}</h4> 
                     <h4 class="ingrdientes">Ingrdientes</h4>
                     <div class="ingrdientes">
                        <ul id="ingredientesData">
                        </ul>
                     </div>
                     <div class="sourceInf">
                        <span><a href="${openSource.uri}">Bon Appetit</a></span>
                        <span><a href="${openSource.url}">More Details</a></span>
                  </div>
               </div>
         </div>
      `;

       reciperLoader.insertAdjacentHTML('beforeend', htmlOpenSource);

       // Load Ingredients //
       const ingredientesData = document.getElementById("ingredientesData");
       openSource.ingredientLines.forEach(element => ingredientesData.insertAdjacentHTML('beforeend',`<li>${element}</li>`));

  
       //Save to bookMarks or delete//
        let save = document.getElementsByName(`${openSource.id_Recipie}`);
        save[0].addEventListener('click', this._saveBookMaeks.bind(this));
        document.getElementsByName(`@${openSource._Recipie}`)[0].addEventListener('change', (e)=>{ document.getElementById(`caloriesid${openSource.id_Recipie}`).textContent =_generateCalories( document.getElementsByName(`@${openSource._Recipie}`)[0].value, openSource.calories)});
       
       // Completed scope//
       console.log("load Successfully");

   }


   // when click any items from container element dom/..//
   _ClickOpenSource(e) {
      let elementItemsBox = e.target.closest('.items_box');
      if (!elementItemsBox) return;
      _removeChildrens(reciperLoader);


      // Open Recipie Source UI//
      this._openDomToggle()
      let idR = elementItemsBox.id;
      this._openSourceUI(idR);

   }


}

export default new Entity();

