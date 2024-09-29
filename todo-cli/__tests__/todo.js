/* eslint-disable no-undef */

const todoList = require('todo-cli/todo');
//const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe('Todo List Tests', () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
  });

  test('should create a new todo', () => {
    todos.add({ title: 'New Todo', dueDate: '2024-07-21', completed: false });
    expect(todos.all.length).toBe(1);
    expect(todos.all[0].title).toBe('New Todo');
    expect(todos.all[0].completed).toBe(false);
  });

  test('should mark a todo as completed', () => {
    todos.add({ title: 'Incomplete Todo', dueDate: '2024-07-21', completed: false });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test('should retrieve overdue items', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    todos.add({ title: 'Overdue Todo', dueDate: yesterday.toISOString().split('T')[0], completed: false });
    const overdueItems = todos.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe('Overdue Todo');
  });

  test('should retrieve due today items', () => {
    const today = new Date().toISOString().split('T')[0];
    todos.add({ title: 'Today Todo', dueDate: today, completed: false });
    const todayItems = todos.dueToday();
    expect(todayItems.length).toBe(1);
    expect(todayItems[0].title).toBe('Today Todo');
  });

  test('should retrieve due later items', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    todos.add({ title: 'Tomorrow Todo', dueDate: tomorrow.toISOString().split('T')[0], completed: false });
    const dueLaterItems = todos.dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe('Tomorrow Todo');
  });
});
