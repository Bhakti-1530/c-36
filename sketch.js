//Create variables here
var dog, dogImg, happyDog, happyDogImg, database, foodS, foodStock;
var feedPet, addFood;
var fedTime, lastFed;
var foodObj;
var gameState, readState;
var garden, washroom, currentTime;
var foodS, foodStock;
function preload()
{
  //load images here
  dogImg = loadImage('images/dogImg.png');
  garden = loadImage("images2/Garden.png");
  washroom = loadImage("images2/Wash Room.png");
  bedroom = loadImage("images2/Bed Room.png");
  
}

function setup() {
  database = firebase.database();
  //console.log(database);
	createCanvas(550, 500);
  dog = createSprite(300, 250, 1, 1);
  dog.addImage('dog', dogImg);
  dog.scale = 0.2;

 var foodStock = database.ref('Food');
  foodStock.on('value', readStock);

  foodObj = new Food;

  feedPet = createButton('Feed the dog');
  feedPet.position(700, 95);
  feedPet.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState = database.ref('gameState');
  readState.on('value',function(data){
    gameState = data.val();
  })
}


function draw() {  
  background(46, 139, 87);
   
    
    if(gameState!='Hungry'){
      feedPet.hide();
      addFood.hide();
      dog.remove();
    }else{
      feedPet.show();
      addFood.show();
      dog.addImage(dogImg);
    }

    currentTime = hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  drawSprites();
  //add styles here
  

}



function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}



function update(state){
  database.ref('/').update({
    gameState:state
  })
}
