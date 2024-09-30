'use strict';
const { Op } = require('sequelize'); // For date comparison operators
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    // Add a new task
    static async addTask(params) {
      return await Todo.create(params);
    }

    // Display the todo list
    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueItems = await Todo.overdue();
      overdueItems.forEach(item => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const todayItems = await Todo.dueToday();
      todayItems.forEach(item => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const laterItems = await Todo.dueLater();
      laterItems.forEach(item => console.log(item.displayableString()));
    }

    // Fetch overdue items (dueDate is less than today)
    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today
          }
        },
        order: [['dueDate', 'ASC']]
      });
    }

    // Fetch today's items (dueDate is equal to today)
    static async dueToday() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: today
        },
        order: [['dueDate', 'ASC']]
      });
    }

    // Fetch items due later (dueDate is greater than today)
    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today
          }
        },
        order: [['dueDate', 'ASC']]
      });
    }

    // Mark a task as completed
    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    // Display task in a formatted way
    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const formattedDate = typeof this.dueDate === 'string' 
        ? this.dueDate  // If dueDate is already a string (from Sequelize)
        : this.dueDate.toISOString().split('T')[0];  // If it's a Date object
      return `${this.id}. ${checkbox} ${this.title} ${formattedDate}`;
    }
    
  }

  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  
  return Todo;
};
