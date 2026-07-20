let streak = Number(localStorage.getItem("streak")) || 0;

let lastLogin =
localStorage.getItem("lastLogin") || "";

let customQuests =
JSON.parse(localStorage.getItem("quests")) || [];

let avatar =
localStorage.getItem("avatar") ||
"assets/avatars/hero.svg";

let level =
Number(localStorage.getItem("level")) || 1;

let xp =
Number(localStorage.getItem("xp")) || 0;

let gold =
Number(localStorage.getItem("gold")) || 0;

let inventory =
JSON.parse(localStorage.getItem("inventory")) || [];


const titles = [
"Novice Adventurer",
"Explorer",
"Warrior",
"Knight",
"Champion",
"Legend"
];



function saveGame(){

localStorage.setItem("level",level);
localStorage.setItem("xp",xp);
localStorage.setItem("gold",gold);
localStorage.setItem("inventory",JSON.stringify(inventory));
localStorage.setItem("avatar",avatar);

}



function updateUI(){

document.getElementById("level").innerText = level;

document.getElementById("gold").innerText = gold;

document.getElementById("streak").innerText = streak;

document.getElementById("avatar").src = avatar;


let need = level * 100;


document.getElementById("xpText").innerText =
xp + " / " + need + " XP";


document.getElementById("xpFill").style.width =
(xp / need) * 100 + "%";


document.getElementById("title").innerText =
titles[Math.min(level-1,titles.length-1)];


loadInventory();

saveGame();

}




function completeQuest(addXP,addGold,btn){

if(btn.disabled)return;


xp += addXP;

gold += addGold;


btn.disabled=true;

btn.innerHTML="✔ Completed";


while(xp >= level*100){

xp -= level*100;

level++;

alert("🎉 Level Up! Level "+level);

}


updateUI();

}





function buyItem(name,price){


if(gold < price){

alert("Not enough Gold!");

return;

}


if(inventory.includes(name)){

alert("Already Owned!");

return;

}


gold -= price;

inventory.push(name);



if(name==="Knight Armor"){

avatar="assets/avatars/knight.svg";

}


if(name==="Dragon Skin"){

avatar="assets/avatars/dragon.svg";

}


alert(name+" Purchased!");

updateUI();

}





function loadInventory(){

let list=document.getElementById("items");


list.innerHTML="";


if(inventory.length===0){

list.innerHTML="<li>No Items</li>";

return;

}


inventory.forEach(item=>{


let li=document.createElement("li");

li.innerHTML="🧰 "+item;

list.appendChild(li);


});


}





function openShop(){

document.getElementById("shop").style.display="block";

}


function closeShop(){

document.getElementById("shop").style.display="none";

}


function openInventory(){

document.getElementById("inventory").style.display="block";

}


function closeInventory(){

document.getElementById("inventory").style.display="none";

}




function resetGame(){

if(confirm("Reset Game?")){

localStorage.clear();

location.reload();

}

}





function addQuest(){


let name =
document.getElementById("questName").value;


let xpReward =
Number(document.getElementById("questXP").value);


let goldReward =
Number(document.getElementById("questGold").value);



if(!name || !xpReward){

alert("Fill quest details!");

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


box.innerHTML="";


customQuests.forEach((q,index)=>{


let div=document.createElement("div");


div.className="quest";


div.innerHTML=`

<span>
${q.name}
<br>
⭐ ${q.xp} XP
💰 ${q.gold} Gold
</span>

<button onclick="completeCustom(${index},this)">
Complete
</button>

`;


box.appendChild(div);


});


}





function completeCustom(index,button){


let q=customQuests[index];


if(q.done)return;


q.done=true;


xp += q.xp;

gold += q.gold;


button.disabled=true;

button.innerHTML="✔ Done";


localStorage.setItem(
"quests",
JSON.stringify(customQuests)
);


updateUI();


}





function checkStreak(){


let today =
new Date().toDateString();


if(lastLogin!==today){


let yesterday=new Date();

yesterday.setDate(
yesterday.getDate()-1
);



if(lastLogin===yesterday.toDateString()){

streak++;

}

else{

streak=1;

}


lastLogin=today;


localStorage.setItem("streak",streak);

localStorage.setItem("lastLogin",lastLogin);


}


}




checkStreak();

displayQuests();

updateUI();
