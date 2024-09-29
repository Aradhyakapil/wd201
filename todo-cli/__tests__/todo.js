/* eslint-disable no-undef */

const todoList = require('../todo');
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10)
    });
  });

  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10)
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: yesterday.toISOString().slice(0, 10)
    });
    expect(overdue().length).toBeGreaterThanOrEqual(1); 
  });

  test("Should retrieve due today items", () => {
    const today = new Date().toISOString().slice(0, 10);
    add({
      title: "Due today todo",
      completed: false,
      dueDate: today
    });
    expect(dueToday().length).toBeGreaterThanOrEqual(1);
  });

  test("Should retrieve due later items", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    add({
      title: "Due tomorrow todo",
      completed: false,
      dueDate: tomorrow.toISOString().slice(0, 10)
    });
    expect(dueLater().length).toBeGreaterThanOrEqual(1);
  });
});
