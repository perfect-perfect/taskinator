var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];
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

    // when submitting a task isEdit will be false, but when editing and submiting isEdit will be true. This is because the attribute data-task-id isn't added to the form DOM objectnuntil after we send the info back into the form fields to be edited 
    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    // package up data as an object and assigns it methods of "name" and "type"
    // this way createTaskEl() will only get called if isEdit is false
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
};

// this is only called if we are editing a task
var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // sets new values in form fields
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content. Updates the object in the array to match the new edits
    
    for (var i = 0; i < tasks.length; i++) {
        // taskId is a string and tasks[i].id is a number. this is why we wrap the task with a parseInt()function and convert it to a number for comparison purposes.
        // If the two id values match, then we've confirmed that the task at that iteration of the for loop is the one we want to update, and we've reassigned that task's name and type property to the new content submitted by the fomr when we are finished editing it.
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!")

    // removes the data-attribute we added when we sent the task back to be edited. ensures that users are able to create new tasks again
    formEl.removeAttribute("data-task-id");
    // changes the button back to Add Task
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
}

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



    // add's the taskIdCounter as a property of the taskDataObject object and 
    taskDataObj.id = taskIdCounter;
    // adds the entire objecct to the tasks array
    tasks.push(taskDataObj);



    // increase task counter for next unique id
    taskIdCounter++;

    saveTasks();
    // console.log(taskDataObj);
    // console.log(taskDataObj.status);
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    // the format of the class name is very curios. there is a space in it and there is no such class in the html. does the space mean we are looking for an edit-btn inside of a element with btn?
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

    // array created so we can reference it directly below in the block of code that creates the <option> elements
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

// this listens for a submit event, which is either a click of a button or pressing enter. it is placed on the DOM parent element 
formEl.addEventListener("submit", taskFormHandler);


var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    // put the content from task and name into the relative form fields
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // changes the "add task" button to say "save task"
    document.querySelector("#save-task").textContent = "Save Task"

    // this will add the taskId to a data-task-id attribute on the form itself
    formEl.setAttribute("data-task-id", taskId);
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    saveTasks();
};

// if a click is sensed in pageContentEl this function will run
var taskButtonHandler = function(event) {
    // get targer element from event
    var targetEl = event.target;
    
    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);


        // When we delete a task we essentially have to create a new array of tasks that is identical to our current one, except it won't receive the tasks we're deleting
        // create new array to hold updated list of tasks
        var updatedTaskArr = [];

        // loop through current tasks
        for (var i = 0; i < tasks.length; i++) {
            // if tasks[i] doesn't match the value of taskId, let's keep that task and push it into the new array
            if (tasks[i].id !== parseInt(taskId)) {
                updatedTaskArr.push(tasks[i]);
            }
        }

        // reassign tasks array to be the same as updateTaskArr
        // we reassign the tasks variable to updatedTasksArr so that they are now the same and do not contain the deleted task.
        tasks = updatedTaskArr;

    }
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // updatethe status of the task in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    // console.log(tasks)

    saveTasks();
};

var loadTasks = function() {
    // gets task items from localStorage
    tasks = localStorage.getItem("tasks");
    console.log(tasks);

    if (tasks === null) {
        tasks = [];
        return false;
    }

    // converts tasks from the string format back into an array of objects
    tasks = JSON.parse(tasks);
    console.log(tasks);

    // iterates through the tasks array and creates task elements on the page from it
    for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i]);

        // keep id for each task in sync
        tasks[i].id = taskIdCounter;

        // create a li element and store it in a variable
        var listItemEl = document.createElement("li");
        
        // give it a className of task-item
        listItemEl.className = "task-item";

        // give it a data-task-id attribute with a value of tasks[i].id
        listItemEl.setAttribute("data-task-id", tasks[i].id);

        
        // create a div element and store it in a variable called taskInfoEl
        var taskInfoEl = document.createElement("div");
        
        // give it a classname property task-info to set the HTML class attribute
        taskInfoEl.className = "task-info";

        // set its innerHTML
        taskInfoEl.innerHTML = "<h3 class ='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        // append taskInfoEl to listItemEl
        listItemEl.appendChild(taskInfoEl);

        // create the actions for the task
        var taskActionsEl = createTaskActions(tasks[i].id);

        // append taskActionsEl to listItemEl
        listItemEl.appendChild(taskActionsEl);

        // with an if statement, check if the value of tasks[i].status is equal to "to do"
        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;

            // append listItemEl to tasksToDoEl
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            // append listItemEl to tasksCompletedEl
            tasksCompletedEl.appendChild(listItemEl);
        
        }

        // increase taskIdCounter by 1
        taskIdCounter++;

        console.log(listItemEl);
    }
}

// a function that saves the array of objects we created so we could store information
var saveTasks = function() {
    // JSON.stringify turns the array of objects "tasks" into a strong so we can store it on localStorage. localStorage only accepts strings. JSON means JavaScript Object Notation
    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// using event delegation we'll add an event listener to a parent element, in this case the main element, that will listen for different types of clicks in that area
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler); 

loadTasks();