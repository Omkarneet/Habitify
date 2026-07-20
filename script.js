```javascript
// ===============================
// QUEST LIFE - GAME SCRIPT
// ===============================


// ---------- ASSETS / SHOP DATABASE ----------

const SHOP_ITEMS = [

{
id:"hero",
name:"Hero",
price:0,
image:"assets/avatars/hero.svg"
},

{
id:"knight",
name:"Knight Armor",
price:200,
image:"assets/avatars/knight.svg"
},

{
id:"dragon",
name:"Dragon Skin",
price:1000,
image:"assets/avatars/dragon.svg"
}

];


// ---------- PLAYER DATA ----------

let streak = Number(localStorage.getItem("streak")) || 0;

let lastLogin =
localStorage.getItem("lastLogin") || "";

let customQuests =
JSON.parse(localStorage.getItem("quests")) || [];

let level =
Number(localStorage.getItem("level")) || 1;

let xp =
Number(localStorage.getItem("xp")) || 0;

let gold =
Number(localStorage.getItem("gold")) || 0;


// inventory stores item IDs

let inventory =
JSON.parse(localStorage.getItem("inventory")) || ["hero"];


let avatar =
localStorage.getItem("avatar") ||
"assets/avatars/hero.svg";


const titles = [
"Novice Adventurer",
"Explorer",
"Warrior",
"Knight",
"Champion",
"Legend"
];


// ---------- SAVE ----------


function saveGame(){

localStorage.setItem("level",level);

localStorage.setItem("xp",xp);

localStorage.setItem("gold",gold);

localStorage.setItem(
"inventory",
JSON.stringify(inventory)
);

localStorage.setItem(
"avatar",
avatar
);

localStorage.setItem(
"streak",
streak
);

}


// ---------- XP SYSTEM ----------


function addXP(amount){

xp += amount;


while(xp >= level*100){

xp -= level*100;

level++;

alert(
"🎉 Level Up! Level "+level
);

}

}


// ---------- UI UPDATE ----------


function updateUI(){

document.getElementById("level")
.innerText=level;


document.getElementById("gold")
.innerText=gold;


document.getElementById("streak")
.innerText=streak;


document.getElementById("avatar")
.src=avatar;



let need=level*100;


document.getElementById("xpText")
.innerText=
xp+" / "+need+" XP";


document.getElementById("xpFill")
.style.width=
(xp/need)*100+"%";



document.getElementById("title")
.innerText=
titles[
Math.min(level-1,titles.length-1)
];



loadInventory();

saveGame();

}


// ---------- QUEST SYSTEM ----------


function completeQuest(addXPAmount,addGoldAmount,btn){


if(btn.disabled)return;


addXP(addXPAmount);

gold+=addGoldAmount;


btn.disabled=true;

btn.innerHTML="✔ Completed";


updateUI();

}



// ---------- SHOP ----------


function renderShop(){

let shop =
document.getElementById("shopItems");


if(!shop)return;


shop.innerHTML="";


SHOP_ITEMS.forEach(item=>{


if(item.id==="hero")
return;


let owned =
inventory.includes(item.id);



let div =
document.createElement("div");


div.className="shopCard";


div.innerHTML=`

<img src="${item.image}">

<h3>${item.name}</h3>

<p>
💰 ${item.price} Gold
</p>


<button

${owned?"disabled":""}

onclick="buyItem('${item.id}')">

${owned?"Owned":"Buy"}

</button>

`;



shop.appendChild(div);


});


}



function buyItem(id){


let item =
SHOP_ITEMS.find(
i=>i.id===id
);



if(!item)return;



if(gold < item.price){

alert("Not enough Gold!");

return;

}



if(inventory.includes(id)){

alert("Already Owned!");

return;

}



gold-=item.price;


inventory.push(id);



alert(
item.name+" Purchased!"
);


updateUI();


}




// ---------- INVENTORY ----------



function loadInventory(){


let list =
document.getElementById("items");


if(!list)return;


list.innerHTML="";



if(inventory.length===0){

list.innerHTML=
"<li>No Items</li>";

return;

}



inventory.forEach(id=>{


let item =
SHOP_ITEMS.find(
i=>i.id===id
);



let li =
document.createElement("li");



li.innerHTML=`

<img src="${item.image}" width="50">

<br>

${item.name}

<br>

<button onclick="equipItem('${id}')">

Equip

</button>

`;



list.appendChild(li);



});


}




function equipItem(id){


let item =
SHOP_ITEMS.find(
i=>i.id===id
);



if(!item)return;


avatar=item.image;


updateUI();


alert(
item.name+" Equipped!"
);


}




// ---------- POPUPS ----------


function openShop(){

renderShop();

document.getElementById("shop")
.style.display="block";

}


function closeShop(){

document.getElementById("shop")
.style.display="none";

}


function openInventory(){

document.getElementById("inventory")
.style.display="block";

}


function closeInventory(){

document.getElementById("inventory")
.style.display="none";

}



// ---------- CUSTOM QUESTS ----------



function addQuest(){


let name =
document.getElementById("questName").value;


let xpReward =
Number(
document.getElementById("questXP").value
);


let goldReward =
Number(
document.getElementById("questGold").value
);



if(!name || !xpReward){

alert(
"Fill quest details!"
);

return;

}



customQuests.push({

name:name,

xp:xpReward,

gold:goldReward,

done:false

});


localStorage.setItem(
"quests",
JSON.stringify(customQuests)
);


displayQuests();


}




function displayQuests(){


let box =
document.getElementById("customQuests");


if(!box)return;


box.innerHTML="";



customQuests.forEach((q,index)=>{


let div =
document.createElement("div");


div.className="quest";


div.innerHTML=`

<span>

${q.name}

<br>

⭐ ${q.xp} XP

💰 ${q.gold} Gold

</span>


<button onclick="completeCustom(${index},this)">

${q.done?"✔ Done":"Complete"}

</button>

`;



box.appendChild(div);



});


}



function completeCustom(index,button){


let q =
customQuests[index];


if(q.done)return;



q.done=true;


addXP(q.xp);


gold+=q.gold;



localStorage.setItem(
"quests",
JSON.stringify(customQuests)
);



button.disabled=true;

button.innerHTML="✔ Done";


updateUI();


}



// ---------- DAILY REWARD ----------



function claimReward(){


let today =
new Date().toDateString();



let claimed =
localStorage.getItem("reward");



if(claimed===today){

document.getElementById("rewardText")
.innerText=
"Already claimed today!";

return;

}



let rewards=[

{
text:"⭐ +100 XP",
xp:100,
gold:0
},

{
text:"💰 +200 Gold",
xp:0,
gold:200
},

{
text:"🎒 Rare Reward",
xp:50,
gold:100
}

];



let reward =
rewards[
Math.floor(
Math.random()*rewards.length
)
];



addXP(reward.xp);


gold+=reward.gold;



document.getElementById("rewardText")
.innerText=
reward.text;



localStorage.setItem(
"reward",
today
);



updateUI();


}



// ---------- STREAK ----------


function checkStreak(){


let today =
new Date().toDateString();



if(lastLogin!==today){


let yesterday =
new Date();


yesterday.setDate(
yesterday.getDate()-1
);



if(
lastLogin===
yesterday.toDateString()
){

streak++;

}

else{

streak=1;

}



lastLogin=today;


localStorage.setItem(
"lastLogin",
lastLogin
);


}


}



// ---------- RESET ----------


function resetGame(){


if(confirm("Reset Game?")){


localStorage.clear();

location.reload();


}


}



// ---------- START ----------


checkStreak();

displayQuests();

updateUI();
```
