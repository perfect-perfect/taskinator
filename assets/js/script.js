var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// This function is titled taskFormHandler because it takes the values input into the from element. packages them as an object. and then runs that object throught the createTaskEl(); function 
var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        // this returns false which makes the conditional critera false, and if the conditional criteria is false then the if statement just ends.
        return false;
    }

    // this resets the forms after the information has been recieved
    formEl.reset();

    // package up data as an object and assigns it methods of "name" and "type"
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
};

// this function creates the task
// what does having taskDataObj here do? sent the object through? what's the difference between this and a parameter?
var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item (Why does this need a div element? review section 4.2.6)/ because form inputs can be hard tocontrol so we always want to wrap them in a <div>
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // this sends taskIdCounter to the createTaskAction, which builds the buttons and dropdown menu for each task
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item we created and compiled to the DOM element we created of the <ul>
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    // the format of the class name is very curios. there is a space in it and there is no such class in the html
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    // ??? what is taskId doing here ???
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // creates select element which will create a drop down menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    // array created so we can reference it in the following section that creates the <option> elements
    var statusChoices = ["To Do", "In Progress", "Completed"];
    // for each of the items in the array, this creates an option element
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

// delete fuctionality of delete button 
var deleteTask = function(taskId) {
    // the plus signs around taskId confuse me here? why do we need them., it's just in quotes
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    console.log(taskSelected);
    // removes the task
    taskSelected.remove(); 
};

// if a click is sensed in pageContentEl this function will run
var taskButtonHandler = function(event) {
    console.log(event.target);
    // event.target reports the element being clicked. if that element matches the class of .delete-btn then the condition will run
    if (event.target.matches(".delete-btn")) {
        // get's the attirbute of data-task-id of the clicked delete button so we know which one was clicked-- then it equals it to the varialble taskId 
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};


// using event delegation we'll add an event listener to a parent element, in this case the main element, that will listen for different types of clicks in that area
pageContentEl.addEventListener("click", taskButtonHandler);