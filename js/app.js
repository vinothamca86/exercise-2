'use strict';
const task = function () {

    var taskInput;
    var addButton;
    var incompleteTasksHolder;
    var completedTasksHolder;

    const INCOMPLETE_TASK = "incomplete-tasks";
    const COMPLETED_TASK = "completed-tasks";

    const createNewTaskElement = function (taskString, arr) {
        var listItem = document.createElement("li");
        var checkBox = document.createElement("input");
        var label = document.createElement("label");
        var editInput = document.createElement("input");
        var editButton = document.createElement("button");
        var deleteButton = document.createElement("button");

        checkBox.type = "checkbox";
        editInput.type = "text";
        editButton.innerText = "Edit";
        editButton.className = "edit";
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete";
        label.innerText = taskString;

        listItem.appendChild(checkBox);
        listItem.appendChild(label);
        listItem.appendChild(editInput);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    };

    const addTask = function () {
        var listItemName = taskInput.value || "New Item";
        addTaskElement(listItemName);
        updateStore(listItemName);
    };

    const addTaskElement = function (listItemName) {
        var listItem = createNewTaskElement(listItemName)
        incompleteTasksHolder.appendChild(listItem)
        bindTaskEvents(listItem, taskCompleted)
        taskInput.value = "";
    };

    const updateStore = function (taskName) {

        if (taskName) {
            var incompleteTask = getItem(INCOMPLETE_TASK) || [];
            incompleteTask.push(taskName);
            setItem(INCOMPLETE_TASK, incompleteTask);
        }
    }

    const editTask = function () {
        var listItem = this.parentNode;
        var editInput = listItem.querySelectorAll("input[type=text")[0];
        var label = listItem.querySelector("label");
        var button = listItem.getElementsByTagName("button")[0];

        var containsClass = listItem.classList.contains("editMode");
        if (containsClass) {
            label.innerText = editInput.value
            button.innerText = "Edit";
        } else {
            editInput.value = label.innerText
            button.innerText = "Save";
        }

        listItem.classList.toggle("editMode");
    };

    const deleteTask = function (el) {

        var listItem = this.parentNode;
        var ul = listItem.parentNode;

        if (ul.id === INCOMPLETE_TASK) {

            var incompleteTask = getItem(INCOMPLETE_TASK) || [];
            const index = incompleteTask.indexOf(listItem.children[1].textContent);
            if (index > -1) {
                incompleteTask.splice(index, 1)
                setItem(INCOMPLETE_TASK, incompleteTask);
            }
        } else if (ul.id === COMPLETED_TASK) {

            var completedTask = getItem(COMPLETED_TASK) || [];
            const index = completedTask.indexOf(listItem.children[1].textContent);
            if (index > -1) {
                completedTask.splice(index, 1)
                setItem(INCOMPLETE_TASK, completedTask);
            }
        }

        ul.removeChild(listItem);
    };

    const taskCompleted = function (el) {
        var listItem = this.parentNode;
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
    };

    const taskIncomplete = function () {
        var listItem = this.parentNode;
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
    };

    const bindTaskEvents = function (taskListItem, checkBoxEventHandler, cb) {
        var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
        var editButton = taskListItem.querySelectorAll("button.edit")[0];
        var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
        editButton.onclick = editTask;
        deleteButton.onclick = deleteTask;
        checkBox.onchange = checkBoxEventHandler;
    };

    const setItem = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const getItem = function (key) {
        return JSON.parse(localStorage.getItem(key));
    };

    const fetchTaskRequest = function () {

        var incompleteTask = getItem(INCOMPLETE_TASK) || [];
        for (var i = 0; i < incompleteTask.length; i++) {
            addTaskElement(incompleteTask[i]);
        }
        // var completedTask = getItem("completed-task") || [];
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            taskInput = document.getElementById("new-task");
            addButton = document.getElementsByTagName("button")[0];
            incompleteTasksHolder = document.getElementById("incomplete-tasks");
            completedTasksHolder = document.getElementById("completed-tasks");
            addButton.addEventListener("click", addTask);

            for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
                bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
            }

            for (var i = 0; i < completedTasksHolder.children.length; i++) {
                bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
            }

            fetchTaskRequest();
        }
    }
}();

