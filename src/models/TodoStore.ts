import { makeAutoObservable } from "mobx";

interface Task {
  id: number;
  text: string;
  description: string;
  completed: boolean;
}

class TodoStore {
  tasks: Task[] = [];
  nextId: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  addTask(text: string, description: string) {
    const newTask = {
      id: this.nextId,
      text,
      description,
      completed: false,
    };
    
    this.tasks.push(newTask);
    this.nextId++;
  }

  toggleTaskCompletion(id: number) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}

export const todoStore = new TodoStore();
