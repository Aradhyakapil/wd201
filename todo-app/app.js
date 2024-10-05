const express = require("express");
const app = express();
const path = require("path");
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const moment = require("moment"); // Make sure moment is installed

app.use(bodyParser.json());
app.set("view engine", "ejs");

// Helper functions to categorize todos by due date
function isOverdue(dueDate) {
    return moment(dueDate).isBefore(moment(), 'day');
}

function isDueToday(dueDate) {
    return moment(dueDate).isSame(moment(), 'day');
}

function isDueLater(dueDate) {
    return moment(dueDate).isAfter(moment(), 'day');
}

// eslint-disable-next-line no-unused-vars
app.get("/", async (request, response) => {
    try {
        const allTodos = await Todo.getTodos(); // Fetch all to-dos from the DB

        // Categorize todos based on their due dates
        const overdueTodos = allTodos.filter(todo => isOverdue(todo.dueDate));
        const dueTodayTodos = allTodos.filter(todo => isDueToday(todo.dueDate));
        const dueLaterTodos = allTodos.filter(todo => isDueLater(todo.dueDate));

        if (request.accepts("html")) {
            response.render("index", {
                overdueTodos,    // Pass overdue todos
                dueTodayTodos,   // Pass today's todos
                dueLaterTodos    // Pass future todos
            });
        } else {
            response.json({
                overdueTodos,
                dueTodayTodos,
                dueLaterTodos
            });
        }
    } catch (error) {
        console.error("Error fetching todos: ", error);
        response.status(500).send("Internal Server Error");
    }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Fetch all todos (API route)
app.get("/todos", async function (_request, response) {
    console.log("Processing list of all Todos ...");
    try {
        const todos = await Todo.findAll();
        return response.json(todos);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Fetch a single todo by id (API route)
app.get("/todos/:id", async function (request, response) {
    try {
        const todo = await Todo.findByPk(request.params.id);
        return response.json(todo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Add a new todo (API route)
app.post("/todos", async function (request, response) {
    try {
        const todo = await Todo.addTodo(request.body);
        return response.json(todo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Mark a todo as completed (API route)
app.put("/todos/:id/markAsCompleted", async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
        const updatedTodo = await todo.markAsCompleted();
        return response.json(updatedTodo);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

// Delete a todo (API route)
app.delete("/todos/:id", async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
        const deleted = await Todo.destroy({
            where: {
                id: request.params.id,
            },
        });
        return response.json(deleted > 0);
    } catch (error) {
        console.log(error);
        return response.status(422).json(error);
    }
});

module.exports = app;
