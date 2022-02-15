(async function () {
  const taskInput = document.getElementById("new");
  const addButton = document.getElementById("add");
  const tasks = document.getElementById("tasks");

  addButton.addEventListener("click", addNewItem);
  taskInput.addEventListener("keyup", processKeyPress);

  const items = await getItems();

  /* Saving Data using Locale storage */
  localStorage.setItem("message", "hello world!");
  // const item = localStorage.getItem(message);

  console.log(items);

  function processKeyPress(event) {
    addButton.disabled = event.target.value.trim() === "";

    if (event.key === "Enter") {
      addNewItem();
    }
  }

  // const items = [];

  for (let item of items) {
    const li = createElementForTask(item);
    tasks.appendChild(li);
  }

  function createElementForTask(item) {
    const template = document.getElementById("taskTemplate");
    const newListItem = template.content.cloneNode(true);

    const checkbox = newListItem.querySelector(".item-check");
    const text = newListItem.querySelector(".item-text");
    const deleteButton = newListItem.querySelector(".delete");

    text.innerText = item.value;
    checkbox.checked = item.complete;

    checkbox.onchange = function (event) {
      item.complete = event.target.checked;
      saveItems();
    };

    deleteButton.onclick = function (event) {
      event.target.closest("li").remove();
      items.splice(items.indexOf(item), 1);
      saveItems();
    };

    return newListItem;
  }

  function addNewItem() {
    const task = {
      value: taskInput.value,
      complete: false,
    };

    items.push(task);
    saveItems();

    let newItem = createElementForTask(task);
    tasks.appendChild(newItem);

    taskInput.value = "";
    taskInput.focus();
  }

  async function getItems() {
    const request = await fetch(
      "https://todo-api-ff.azurewebsites.net/api/todo",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const itemsJson = (await request.text()) || "[]";
    return JSON.parse(itemsJson);
  }

  async function saveItems() {
    const data = JSON.stringify(items);

    await fetch("https://todo-api-ff.azurewebsites.net/api/todo", {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: data,
    });
  }
})();
