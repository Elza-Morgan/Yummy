//? ===== loading Screen =====
jQuery(function (){
  //when the page is loading we are calling function searchingByName() and sending empty strings to load all the meals
  //then fade out loading as user experience that all content is loaded
  searchingByName("").then(()=>{
    $(".loading-screen").fadeOut(300, function () {
      $("body").css({ overflow: "auto" });
    });
  })
});

//? ===== Displaying first 20 meals when the page loads up =====
async function displayHomeMeal(homeMeals) {
  let innerHtml = '';
    for (let i = 0; i < homeMeals.length; i++) {
      innerHtml += `<div class="col-md-3">
      <div class="inner-meal position-relative" id="inner-meal" onclick="gettingMealsFullDetails(${homeMeals[i].idMeal})">
          <!--!from API FOOD images -->
        <img class="w-100 rounded-2 cursor-pointer" src="${homeMeals[i].strMealThumb}" alt="">
        <div class="inner-overlay rounded-2 d-flex align-items-center px-2">
          <!--!from API FOOD name -->
          <h3>${homeMeals[i].strMeal}</h3>
        </div>
      </div>
    </div>`
    }
    $("#home-meals").html(innerHtml);
}

//? ===== Nav Menu Toggler =====
let lengthOfSideMenu = $("#side-menu .side-menu-black").outerWidth();
$("#side-menu .side-menu-black").css({ left: `-${lengthOfSideMenu}px` });
let isShown = false;
function navMenuToggler() {
  if (isShown === true) {
    //~ ===== closing side menu =====
    $("#side-menu .side-menu-black").animate({ left: `-${lengthOfSideMenu}px` }, 500);
    $("#side-menu .side-menu-white").animate({ left: `0px` }, 500);
    $("#side-menu-white i").removeClass("fa-x").addClass("fa-bars");;
    isShown = false;
    //~ calling function that animated the list back to original like in CSS
    navSlideDown();

  } else {
    //~ ===== opening side menu =====
    $("#side-menu .side-menu-black").animate({ left: `0px` }, 500);
    $("#side-menu .side-menu-white").animate({ left: `15%` }, 500);
    $("#side-menu-white>i").removeClass("fa-bars").addClass("fa-x");
    //~ calling function that animated the list
    navSlideUp();
    isShown = true;
  }
}
// navMenuToggler();


function navMenuClose() {
  $("#side-menu .side-menu-black").animate({ left: `-${lengthOfSideMenu}px` }, 500);
  $("#side-menu .side-menu-white").animate({ left: `0px` }, 500);
  $("#side-menu-white i").removeClass("fa-x").addClass("fa-bars");;
  isShown = false;
  navSlideDown();
}

//? ===== Animation for menu-list =====
// So basically i'm calling this function and accessing the list in ul and
// looping over it using "each" method which takes anonymous function and loops over the list as if they are array
// and also it take an "array"
//usually it recieves two params  1 - "index" == >  which is the index number of this elememt in list and 2- "item" ==> which access the value of the index or the element itself.
//! Watch out order matter in each(<index first >< item second>)
function navSlideUp() {
  $("#side-menu .side-menu-black .menu ul li").each(function (index) {
    //(index + 5) ==> creats the delay and this creats a staggered effect where each animation starts a bit later than the previous one.
    // N.O 5 ==> the higher it gets the slower the effect will be
    //then *100 ==> to convert it to ms;
    $(this).animate({ top: "0px" }, (index + 5) * 100);
    console.log("In loop");
  });
}

function navSlideDown() {
  $("#side-menu .side-menu-black .menu ul li").each(function (index) {
    $(this).animate({ top: "18rem" }, (index + 5) * 100);
    console.log("In loop");
  });
}

//? ===== Getting Meals full Details =====

async function gettingMealsFullDetails(mealIds) {
  navMenuClose();
  $("#home-meals").empty();
  // $(".loading-screen-inner").fadeIn(1000).css({display: "flex"});
  $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });
  // console.log(fadeIn());
  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealIds}`);
  let response = await request.json();
  // console.log(response);
  // sending the full data of the partical id when clicked on to be displayed and always index 0 cuz it will always be the first thing as it comes in array
  displayinggMealsFullDetails(response.meals[0]);
  // $(".loading-screen-inner").fadeOut(1000).css({display: "none"});
  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });
}

//? ===== Displaying Meals full Details =====
function displayinggMealsFullDetails(mealDetails) {
  // this is used to remove spaces of search inputs which is originaly none in CSS and shown when needed by flex
  $("#search-section").empty().css({ display: "none" });
  //filling recipes
  let recipes = ``;
  let mainContent = ``;
  // console.log(mealDetails);
  //dictionary ==> accessing like an indexing in a array but by key
  //in this case literal template used because the key type is string
  for (let i = 1; i < 21; i++) {

    if (mealDetails[`strIngredient${i}`] === '') {
      break;
    }

    recipes += `<li class="p-1 m-2 alert alert-info">${mealDetails[`strMeasure${i}`]} ${mealDetails[`strIngredient${i}`]}</li>`;
  }

  // console.log(recipes);
  // console.log(recipes.length);

  let strTags = mealDetails["strTags"];
  let tags = [];
  let tagsStorage = ``;

  if (strTags) {
    tags = strTags.split(",");
    console.log("in if condition tags");
  }

  for (let i = 0; i < tags.length; i++) {
    tagsStorage += `<li  class="p-1 m-2 alert alert-danger">${tags[i]}</li>`
  }

  mainContent = `<div class="col-md-4">
  <!-- change image url from api -->
  <img
    class="rounded-3 w-100"
    src="${mealDetails.strMealThumb}"
    alt=""
  />
  <!-- change meal name from api -->
  <h2>${mealDetails.strMeal}</h2>
</div>

<div class="col-md-8">
  <h2>Instructions</h2>

  <!-- change the instruction from API -->
  <p class="">${mealDetails.strInstructions}</p>

  <!-- change area,category and recipes from API -->
  <h3 class="fw-bold">Area : <span class="fw-medium">${mealDetails.strArea}</span></h3>
  <h3 class="fw-bold">Category : <span class="fw-medium">${mealDetails.strCategory}</span></h3>
  <h3>Recipes :</h3>
  <!-- list will be generated according size of array from API -->
  <ul id="recipes">${recipes}</ul>

  <h3>Tags :</h3>
  <!-- list will be generated according size of array from API -->
  <ul id="tags">${tagsStorage}</ul>

  <!-- href will be generated from API -->
  <a type="button" class="btn btn-success px-3" role="button" href="${mealDetails.strSource}">Source</a>
  <a type="button" class="btn btn-danger px-3" role="button" href="${mealDetails.strYoutube}">Youtube</a>

</div>`

  $("#home-meals").html(mainContent);

}


//? ===== Searching from Nav-Menu List =====

$("#search").on("click", function () {
  //this clears out, whats already found when the page is re-loaded
  //in order to display the content related to inputs the user enters.
  $("#home-meals").empty();
  $("#search-section").html(`<div class="col-md-6">
    <input type="text" class="form-control text-white bg-transparent search-form" placeholder="Search By Name" onkeyup="searchingByName(this.value)">
  </div>
  <div class="col-md-6">
    <input type="text" class="form-control text-white bg-transparent search-form" placeholder="Search By First Letter" onkeyup="searchingByFirstLetter(this.value)">
  </div>

</div>`).css({ display: "flex" });
  navMenuClose();
});

//? ===== Searching by the name of the food =====
async function searchingByName(name) {
  navMenuClose();
  $("#home-meals").empty();
  // this condition to avoid empty string recieved when page is reload to be shown, otherwise activate it
  if(name ==! ""){
    $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });
  }

  // may be recieved by a caertain name or empty string to show the 25 meals found in API
  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  if (request.status === 200) {
    let response = await request.json();
    // console.log("recieved meals");
    // console.log(response.meals);
    if(response.meals != ""){ //checks the array  of meals from API isn't empty
      //calling the display meals at home and sending the meals
      displayHomeMeal(response.meals);
    }else{
      searchingByName(""); //recalling the function and sending empty string to display all the meals in the API
    }

  }else{
    console.log("nothing recieved");
  }
  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });

}


//? ===== Searching by letter of the food =====

async function searchingByFirstLetter(letter){
  navMenuClose();
  $("#home-meals").empty();
    $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });

  //setting default value if the letter recieved is empty from user
    if(letter == ""){
      letter='a';
    }

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);

  if(request.status === 200){
    let response = await request.json();

    if(response.meals != ""){ //checks the array  of meals from API isn't empty
      //calling the display meals at home and sending the meals
      displayHomeMeal(response.meals);
    }else{
      searchingByName(""); //recalling the function and sending empty string to display all the meals in the API
    }

  }else{
    console.log("nothing recieved");
  }

  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });

}

//? ===== dealing when clicking on catagory from the nav-menu / getting categories from API =====
$("#categories").on("click", async function(){
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);

  if(request.status === 200){
  let response = await request.json();
  displayingCategories(response.categories);
    console.log(response.categories);

  }else{
  console.log("nothing recieved");
  }
  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });
});


//? ===== Displaying the categories =====

function displayingCategories(categories){
  let innerHtml=``;

  for(let i= 0; i<categories.length;i++ ){
    innerHtml+=`<div class="col-md-3">
    <div id="inner-meal-categories" class="inner-meal-categories rounded-2" onclick="gettingCatagoryMeals('${categories[i].strCategory}')">
      <img class="w-100 cursor-pointer" src="${categories[i].strCategoryThumb}" alt="">
      <div class="inner-overlay-categories rounded-2 p-2">
        <h3>${categories[i].strCategory}</h3>
        <p>${categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
      </div>
    </div>     
  </div>`
  }

  $("#home-meals").html(innerHtml);

}

//? ===== Getting the categories Meals according to what is clicked=====

async function gettingCatagoryMeals(mealsOfCat){
  navMenuClose();
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealsOfCat}`);
  
    if(request.status === 200){
      let response = await request.json();
      displayHomeMeal(response.meals.slice(0, 20)); //limits it to 20 meals only

    }else{
    console.log("nothing recieved");

    }
  
    $(".loading-screen-inner").fadeOut(300, function () {
      $(this).css({ display: "none" });
    });
}


//? ===== Getting Area infos when clicked from nav menu list =====


$("#area").on("click",  async function(){
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function (){
    $(this).fadeIn(300);
  });

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);

  if(request.status === 200){
    let response = await request.json();
    //display for area
    displayingArea(response.meals)

  }else{
    console.log("nothing recieved");

  }
  
  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });

});


//? ===== displaying Area =====

function displayingArea(area) {
  let innerHTML=``;

  for (let i = 0; i < area.length; i++) {
    innerHTML += `
      <div class="col-md-3">
              <div onclick="gettingAreaMeals('${area[i].strArea}')" class=" text-center area rounded-2">
              <i class="fa-solid fa-house-laptop fa-5x"></i>
                  <h3>${area[i].strArea}</h3>
              </div>
      </div>
      `
  }
  $("#home-meals").html(innerHTML);
  
}


//? ===== Getting meals accroding to the Area =====

async function gettingAreaMeals(areaMeals){
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function () {
    $(this).fadeIn(300);
  });
  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaMeals}`);

  if(request.status === 200){
    let response = await request.json();
    displayHomeMeal(response.meals.slice(0, 20)); //limits it to 20 meals only

  }else{
    console.log("nothing recieved");

  }

  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });

}

//? ===== Getting Ingredients info when clicking it from nav menu =====

$("#ingredients").on("click",async function gettingIngredients(){
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function (){
    $(this).fadeIn(300);
  });

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);

  if(request.status === 200){
    let response = await request.json();
    //calling for displaying Ingredients function
    displayingIngredients(response.meals.slice(0, 20));

  }else{
    console.log("nothing recieved");

  }

  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });

});


//? ===== displaying Ingredients=====

async function displayingIngredients(ingredients){
  let innerHTML=``;
  for (let i = 0; i < ingredients.length; i++) {
    innerHTML += `
      <div class="col-md-3">
              <div onclick="gettingIngredientsMeals('${ingredients[i].strIngredient}')" class=" text-center area rounded-2">
              <i class="fa-solid fa-drumstick-bite fa-5x"></i>
              <h3>${ingredients[i].strIngredient}</h3>
              <p>${ingredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
      </div>
      `
  }
  $("#home-meals").html(innerHTML);

}


//? ===== getting meals according to the ingrediant =====

async function gettingIngredientsMeals(ingredientsMeals){
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function (){
    $(this).fadeIn(300);
  });

  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsMeals}`);

  if(request.status === 200 ){
    let response = await request.json();
    displayHomeMeal(response.meals.slice(0, 20));

  }else{
    console.log("nothing recieved");

  }

  $(".loading-screen-inner").fadeOut(300, function () {
    $(this).css({ display: "none" });
  });
}

//? ===== showing Contact us form =====
 //~ to know which input field was focued and user interacted with and to make sure all are inputs are valid and entered by the user.
 let nameInputFocused, emailInputFocused, phoneInputFocused, ageInputFocused, passwordInputFocused,repasswordInputFocused = false;
$("#contactUs").on("click",()=>{
  navMenuClose();
  $("#search-section").empty().css({ display: "none" });
  $("#home-meals").empty();
  $(".loading-screen-inner").css(({ display: "flex" }), function (){
    $(this).fadeIn(300);
  });

  $("#home-meals").html(`<div class="contact-us-section d-flex justify-content-center align-items-center vh-100">
  <div class="container w-75 d-flex flex-column align-items-center">
    <div class="row g-4">
      <div class="col-md-6">
        <input type="text" class="form-control" id="name" placeholder="Enter Your Name" onkeyup="isValid()">
        <div id="nameError" class="form-text alert alert-danger text-center alertError d-none">
          Special characters and numbers not allowed
        </div>
      </div>

      <div class="col-md-6">
        <input type="email" class="form-control" id="email" placeholder="Enter Your Email" onkeyup="isValid()">
        <div id="emailError" class="form-text alert alert-danger text-center alertError d-none">
          Email not valid *exemple@yyy.zzz
        </div>
      </div>

      <div class="col-md-6">
        <input type="text" class="form-control" id="phoneNumber" placeholder="Enter Your Phone" onkeyup="isValid()">
        <div id="phoneError" class="form-text alert alert-danger text-center alertError d-none">
          Enter valid Phone Number
        </div>
      </div>

      <div class="col-md-6">
        <input type="number" class="form-control" id="age" placeholder="Enter Your Age" onkeyup="isValid()">
        <div id="ageError" class="form-text alert alert-danger text-center alertError d-none">
          Enter valid age
        </div>
      </div>

      <div class="col-md-6">
        <input type="password" class="form-control" id="password" placeholder="Enter Your Password" onkeyup="isValid()">
        <div id="passwordError" class="form-text alert alert-danger text-center alertError d-none">
          Enter valid password *Minimum eight characters, at least one letter and one number:*
        </div>
      </div>

      <div class="col-md-6">
        <input type="password" class="form-control" id="repassword" placeholder="Confirm Password" onkeyup="isValid()">
        <div id="repasswordError" class="form-text alert alert-danger text-center alertError d-none">
          Enter valid repassword 
        </div>
      </div>

    </div>
    <button type="button" class="btn btn-outline-danger disabled mt-3" id="submitBtn">Submit</button>
  </div>
</div> `);

$("#name").on("focus",()=>{
  nameInputFocused = true;
});

$("#email").on("focus",()=>{
  emailInputFocused = true;
});

$("#phoneNumber").on("focus",()=>{
  phoneInputFocused = true;
});

$("#age").on("focus",()=>{
  ageInputFocused = true;
});

$("#password").on("focus",()=>{
  passwordInputFocused = true;
});

$("#repassword").on("focus",()=>{
  repasswordInputFocused = true;
});

$(".loading-screen-inner").fadeOut(300, function () {
  $(this).css({ display: "none" });
});

});
//? ===== pattern/ Regex for the user inputs =====

function nameRegex(){
  let namePattern = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  if(namePattern.test($("#name").val())){
    return true;
  }
}

function emailRegex(){
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if(emailPattern.test($("#email").val())){
    return true;
  }
}

function phoneRegex(){
  let phonePattern = /^(?:\+?20|0)?1[0-5]\d{8}$/;
  if(phonePattern.test($("#phoneNumber").val())){
    return true;
  }
}

function agRegex(){
  let agePattern = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/; //makes sure the age number falls between 1 to 120
  if(agePattern.test($("#age").val())){
    return true;
  }
}

function passwordRegex(){
  let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number 
  if(passwordPattern.test($("#password").val())){
    return true;
  }
}
//checks on both password fields are identical 
function confirmPass(){
  if($("#password").val() === $("#repassword").val()){
    return true;
  }
}

//? ===== checking the validation of the user inputs and displaying alert error if not valid =====

function isValid(){
  // check on the focuse input
  //check if the regex is valid or matches the input pattern expexted
  // enable the submit button

  if(nameInputFocused == true){
    if(nameRegex() == true){
      $("#nameError").removeClass("d-block").addClass("d-none");
    }else{
      $("#nameError").removeClass("d-none").addClass("d-block");
    }
  }

  if(emailInputFocused == true){
    if(emailRegex() == true){
      $("#emailError").removeClass("d-block").addClass("d-none");
    }else{
      $("#emailError").removeClass("d-none").addClass("d-block");
    }
  }

  if(phoneInputFocused == true){
    if(phoneRegex() == true){
      $("#phoneError").removeClass("d-block").addClass("d-none");
    }else{
      $("#phoneError").removeClass("d-none").addClass("d-block");
    }
  }

  if(ageInputFocused == true){
    if(agRegex() == true){
      $("#ageError").removeClass("d-block").addClass("d-none");
    }else{
      $("#ageError").removeClass("d-none").addClass("d-block");
    }
  }

  if(passwordInputFocused == true){
    if(passwordRegex() == true){
      $("#passwordError").removeClass("d-block").addClass("d-none");
    }else{
      $("#passwordError").removeClass("d-none").addClass("d-block");
    }
  }

  if(repasswordInputFocused == true){
    if(confirmPass() == true){
      $("#repasswordError").removeClass("d-block").addClass("d-none");
    }else{
      $("#repasswordError").removeClass("d-none").addClass("d-block");
    }
  }

  if(nameRegex()==true && emailRegex() == true && phoneRegex() == true && agRegex() == true && passwordRegex() == true && confirmPass() == true ){
    console.log("inside if");
    //disabled is a conidered as "class" in bootstrap
    $("#submitBtn").removeClass("disabled"); 
  }else{
    $("#submitBtn").addClass("disabled"); 
  }
}

