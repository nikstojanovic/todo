window.onload = function() {
    // if there is no localStorage data, initialize array, else, fill the array with localStorage data
    if (!localStorage.getItem("task")) {
        arrayTask = [];
    } else {
        arrayTask = localStorage.getItem("task").split(",");
    }

    // show the tasks from local storage
    showTasks(arrayTask);

    // add a task if 'enter' is pressed
    window.onkeydown = function(event) {
        if (event.keyCode == 13) {
            addTask();
        }
    }
    document.getElementById("btnNewTask").addEventListener("click", addTask);
    document.getElementById("txtFilterTasks").addEventListener("keyup", filterTasks);
    document.getElementById("btnClearTasks").addEventListener("click", clearAllTasks);
}

// add a single task to localStorage
function addTask() {
    let newTaskTextField = document.getElementById("txtNewTask");

    if (newTaskTextField.value !== "") {
        arrayTask.push(newTaskTextField.value);
        localStorage.setItem("task", arrayTask);
        showTasks(arrayTask);
        newTaskTextField.value = "";
        newTaskTextField.focus();
        document.getElementById("txtFilterTasks").value = "";
    } else {
        alert("Task text field cannot be blank");
    }
}

// show tasks from localStorage
function showTasks(arrayToShow) {
    document.getElementById("tasksContainer").innerHTML = "";

    if (typeof(Storage) !== "undefined") {
        for (let i = 0; i < arrayToShow.length; i++) {
            // create single task container
            let taskContainer = document.createElement("DIV");
            taskContainer.className = "singleTask";
            // create single task text content
            let taskSpan = document.createElement("SPAN");
            let taskContent = document.createTextNode(arrayToShow[i]);
            taskSpan.appendChild(taskContent);
            taskContainer.appendChild(taskSpan);
            // create single task delete button
            let taskDeleteIcon = document.createElement("I");
            taskDeleteIcon.className = "fas fa-times";
            taskDeleteIcon.title = "Delete this task";
            taskDeleteIcon.setAttribute("onclick", "deleteTask(event)");
            taskContainer.appendChild(taskDeleteIcon);
            // add everything to list of tasks
            document.getElementById("tasksContainer").appendChild(taskContainer);
            // clear new task text box
            document.getElementById("txtNewTask").value = "";
        }
    } else {
        alert("Sorry! Your browser doesn't support Web Storage, all changes will be lost when you turn off your browser.");
    }
}

function filterTasks() {
    let txtToFilter = document.getElementById("txtFilterTasks").value.toUpperCase();
    const filteredArray = arrayTask.filter(word => word.toUpperCase().indexOf(txtToFilter) > -1);
    showTasks(filteredArray);
}

// delete all tasks from screen and from localStorage
function clearAllTasks() {
    let taskContainer = document.getElementById("tasksContainer");

    if (taskContainer.innerHTML !== "" && confirm("Do you really want to clear all the tasks?")) {
        // delete all items with 'task' key prefix from localStorage
        localStorage.removeItem("task");
        arrayTask = [];
        // clear task container
        taskContainer.innerHTML = "";
        // clear filter text box
        document.getElementById("txtFilterTasks").value = "";
    }
}

// delete a single task
function deleteTask(event) {
    if (confirm("Do you really want to delete this task?")) {
        let objParent = event.target.parentElement;

        // delete selected element from memory
        for (let i = 0; i < arrayTask.length; i++) {
            if (objParent.getElementsByTagName("SPAN")[0].innerHTML === arrayTask[i]) {
                arrayTask.splice(i, 1);
                localStorage.setItem("task", arrayTask);
                break; // necessary if there are several identical task entries
            }
        }
        // remove selected element from DOM
        objParent.remove();
        // if there is something in filter text box, show only filtered results, else, show the whole list of tasks
        if (document.getElementById("txtFilterTasks").value != "") {
            filterTasks();
        } else {
            showTasks(arrayTask);
        }
    }
}