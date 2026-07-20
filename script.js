let level = Number(localStorage.getItem("level")) || 1;
let xp = Number(localStorage.getItem("xp")) || 0;
let gold = Number(localStorage.getItem("gold")) || 0;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

const titles = [
  "Novice Adventurer",
  "Explorer",
  "Warrior",
  "Knight",
  "Champion",
  "Legend"
];

function saveGame() {
  localStorage.setItem("level", level);
  localStorage.setItem("xp", xp);
  localStorage.setItem("gold", gold);
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function updateUI() {
  document.getElementById("level").innerText = level;
  document.getElementById("gold").innerText = gold;

  let need = level * 100;

  document.getElementById("xpText").innerText =
    xp + " / " + need + " XP";

  document.getElementById("xpFill").style.width =
    (xp / need) * 100 + "%";

  document.getElementById("title").innerText =
    titles[Math.min(level - 1, titles.length - 1)];

  loadInventory();

  saveGame();
}

function completeQuest(addXP, addGold, btn) {

  if (btn.disabled) return;

  xp += addXP;
  gold += addGold;

  btn.disabled = true;
  btn.innerHTML = "✔ Completed";

  while (xp >= level * 100) {
    xp -= level * 100;
    level++;
    alert("🎉 Level Up! You reached Level " + level);
  }

  updateUI();
}

function buyItem(name, price) {

  if (gold < price) {
    alert("Not enough Gold!");
    return;
  }

  if (inventory.includes(name)) {
    alert("Already Owned!");
    return;
  }

  gold -= price;
  inventory.push(name);

  alert(name + " Purchased!");

  updateUI();
}

function loadInventory() {

  const list = document.getElementById("items");

  list.innerHTML = "";

  if (inventory.length == 0) {
    list.innerHTML = "<li>No Items</li>";
    return;
  }

  inventory.forEach(item => {

    let li = document.createElement("li");

    li.innerHTML = "🧰 " + item;

    list.appendChild(li);

  });

}

function openShop() {
  document.getElementById("shop").style.display = "block";
}

function closeShop() {
  document.getElementById("shop").style.display = "none";
}

function openInventory() {
  document.getElementById("inventory").style.display = "block";
}

function closeInventory() {
  document.getElementById("inventory").style.display = "none";
}

function resetGame() {

  if (!confirm("Reset Game?")) return;

  localStorage.clear();
  location.reload();

}

updateUI();
