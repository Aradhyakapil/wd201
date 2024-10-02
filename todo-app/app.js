const express = require( 'express' )
const app = express ()
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const { Todo } = require("./models")

// eslint-disable-next-line no-unused-vars
app.get("/todos", async (request, response) => {
    try {
        const todos = await Todo.findAll();
        return response.json(todos)
    } catch (error) {
        console.log(error)
        return response.status(422).json(error) 
    }
})
app.post("/todos", async (request, response) => {
    console.log("Creating a todo", request.body)
    try {
        const todo = await Todo.addTodo({ title: request.body. title, dueDate: request.body. dueDate, completed:false})
        return response.json(todo)
    } catch (error) {
        console. log(error)
        return response.status(422).json(error) 
    }
})

// PUT http://mytodoapp.com/todos/123/markAsCompleted
app.put("/todos/:id/markAsCompleted", async (request, response) => {
    console.log("We have to update a todo with ID:", request.params.id)
    const todo = await Todo. findByPk(request.params.id)
    try {
        const updatedTodo = await todo.markAsCompleted()
        return response.json(updatedTodo)
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)   
    }
})
// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", async (request, response) => {
    console.log("Delete a todo by ID: ", request.params.id)
    try {
        const deleted = await Todo.destroy({
            where: {
                id: request.params.id
            }
        })
        return response.json(deleted > 0) 
    } catch (error) {
        console.log(error)
        return response.status(422).json(error) 
    }
})

module.exports=app;
