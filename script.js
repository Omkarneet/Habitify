// ===============================
// QUEST LIFE SCRIPT
// ===============================


// ---------- ASSETS ----------

const SHOP_ITEMS = [
    {
        id: "hero",
        name: "Hero",
        price: 0,
        image: "assets/avatars/hero.svg"
    },
    {
        id: "knight",
        name: "Knight Armor",
        price: 200,
        image: "assets/avatars/knight.svg"
    },
    {
        id: "dragon",
        name: "Dragon Skin",
        price: 1000,
        image: "assets/avatars/dragon.svg"
    }
];


// ---------- PLAYER DATA ----------

let level = Number(localStorage.getItem("level")) || 1;

let xp = Number(localStorage.getItem("xp")) || 0;

let gold = Number(localStorage.getItem("gold")) || 0;

let streak = Number(localStorage.getItem("streak")) || 0;

let lastLogin = localStorage.getItem("lastLogin") || "";

let avatar = localStorage.getItem("avatar") || "assets/avatars/hero.svg";

let inventory = JSON.parse(localStorage.getItem("inventory")) || ["hero"];

let customQuests =
JSON.parse(localStorage.getItem("quests")) || [];


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

    localStorage.setItem("level", level);
    localStorage.setItem("xp", xp);
    localStorage.setItem("gold", gold);
    localStorage.setItem("streak", streak);
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("inventory", JSON.stringify(inventory));
}


// ---------- UPDATE UI ----------

function updateUI(){

    document.getElementById("level").innerText = level;

    document.getElementById("gold").innerText = gold;

    document.getElementById("streak").innerText = streak;

    document.getElementById("avatar").src = avatar;


    let requiredXP = level * 100;


    document.getElementById("xpText").innerText =
    xp + " / " + requiredXP + " XP";


    document.getElementById("xpFill").style.width =
    (xp / requiredXP) * 100 + "%";


    document.getElementById("title").innerText =
    titles[Math.min(level-1,titles.length-1)];


    loadInventory();

    saveGame();

}


// ---------- XP ----------

function addXP(amount){

    xp += amount;


    while(xp >= level * 100){

        xp -= level * 100;

        level++;

        alert("🎉 Level Up! Level " + level);

    }

}



// ---------- QUESTS ----------


function completeQuest(addXP, addGold, button){

    if(button.disabled)
    return;


    addXPFunction(addXP);

    gold += addGold;


    button.disabled = true;

    button.innerHTML = "✔ Completed";


    updateUI();

}



function addXPFunction(amount){

    addXP(amount);

}




// ---------- SHOP ----------


function openShop(){

    renderShop();

    document.getElementById("shop").style.display="block";

}


function closeShop(){

    document.getElementById("shop").style.display="none";

}



function renderShop(){

    let box=document.getElementById("shopItems");


    if(!box)
    return;


    box.innerHTML="";


    SHOP_ITEMS.forEach(item=>{


        if(item.id==="hero")
        return;


        let owned=inventory.includes(item.id);


        let div=document.createElement("div");


        div.className="shopCard";


        div.innerHTML=`

        <img src="${item.image}" width="80">

        <h3>${item.name}</h3>

        <p>💰 ${item.price} Gold</p>


        <button onclick="buyItem('${item.id}')">

        ${owned ? "Owned" : "Buy"}

        </button>

        `;


        box.appendChild(div);


    });

}



function buyItem(id){

    let item=SHOP_ITEMS.find(x=>x.id===id);


    if(!item)
    return;


    if(inventory.includes(id)){

        alert("Already Owned!");

        return;

    }


    if(gold < item.price){

        alert("Not enough Gold!");

        return;

    }


    gold -= item.price;


    inventory.push(id);


    alert(item.name+" Purchased!");


    updateUI();

}




// ---------- INVENTORY ----------


function openInventory(){

    document.getElementById("inventory").style.display="block";

}



function closeInventory(){

    document.getElementById("inventory").style.display="none";

}




function loadInventory(){

    let list=document.getElementById("items");


    if(!list)
    return;


    list.innerHTML="";


    inventory.forEach(id=>{


        let item=SHOP_ITEMS.find(x=>x.id===id);


        if(!item)
        return;


        let li=document.createElement("li");


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

    let item=SHOP_ITEMS.find(x=>x.id===id);


    if(!item)
    return;


    avatar=item.image;


    updateUI();


}



// ---------- CUSTOM QUEST ----------


function addQuest(){

    let name=document.getElementById("questName").value;

    let xpReward=Number(document.getElementById("questXP").value);

    let goldReward=Number(document.getElementById("questGold").value);



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

    let box=document.getElementById("customQuests");


    if(!box)
    return;


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

        ${q.done ? "✔ Done" : "Complete"}

        </button>

        `;


        box.appendChild(div);


    });

}




function completeCustom(index,button){

    let q=customQuests[index];


    if(q.done)
    return;


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



// ---------- REWARD ----------


function claimReward(){

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
        }

    ];


    let reward=
    rewards[Math.floor(Math.random()*rewards.length)];


    addXP(reward.xp);

    gold+=reward.gold;


    document.getElementById("rewardText").innerText =
    reward.text;


    updateUI();

}




// ---------- RESET ----------


function resetGame(){

    if(confirm("Reset Game?")){

        localStorage.clear();

        location.reload();

    }

}



// ---------- START ----------


displayQuests();

updateUI();
