import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Checkbox, IconButton, Button, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Интерфейс задачи
interface Task {
  text: string;
  description: string;
  completed: boolean;
  subtasks: Task[];
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { text: newTask, description: newDescription, completed: false, subtasks: [] },
      ]);
      setNewTask('');
      setNewDescription('');
    }
  };

  const addSubtask = (path: string) => {
    const subtaskText = prompt('Введите подзадачу:');
    if (!subtaskText) return;

    const updatedTasks = [...tasks];
    const pathArray = path.split('-').map(Number);
    let current = updatedTasks[pathArray[0]];

    for (let i = 1; i < pathArray.length; i++) {
      current = current.subtasks[pathArray[i]] as Task;
    }

    current.subtasks.push({
      text: subtaskText,
      description: '',
      completed: false,
      subtasks: [],
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (path: string) => {
    const updatedTasks = [...tasks];
    const pathArray = path.split('-').map(Number);

    if (pathArray.length === 1) {
      updatedTasks.splice(pathArray[0], 1);
    } else {
      let current = updatedTasks[pathArray[0]];

      for (let i = 1; i < pathArray.length - 1; i++) {
        current = current.subtasks[pathArray[i]] as Task;
      }

      current.subtasks.splice(pathArray[pathArray.length - 1], 1);
    }

    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (path: string) => {
    const updatedTasks = [...tasks];
    const pathArray = path.split('-').map(Number);

    let current = updatedTasks[pathArray[0]];

    for (let i = 1; i < pathArray.length; i++) {
      current = current.subtasks[pathArray[i]] as Task;
    }

    current.completed = !current.completed;
    updateSubtasksCompletion(current, current.completed);
    updateParentCompletion(path, updatedTasks);

    setTasks(updatedTasks);
  };

  const updateSubtasksCompletion = (task: Task, completed: boolean) => {
    task.subtasks.forEach((subtask) => {
      subtask.completed = completed;
      updateSubtasksCompletion(subtask, completed);
    });
  };

  const updateParentCompletion = (path: string, tasks: Task[]) => {
    const pathArray = path.split('-').map(Number);

    while (pathArray.length > 0) {
      const parentPath = pathArray.slice(0, -1);
      let parent: Task | null = null;
      let currentTasks = tasks;

      parentPath.forEach((index) => {
        parent = currentTasks[index] as Task;
        currentTasks = parent.subtasks;
      });

      if (parent) {
        parent.completed = parent.subtasks.every((subtask) => subtask.completed);
      }
      pathArray.pop();
    }
  };

  const toggleSubtasks = (path: string) => {
    setExpandedPaths((prevPaths) =>
      prevPaths.includes(path)
        ? prevPaths.filter((p) => p !== path)
        : [...prevPaths, path]
    );
  };

  const renderSubtasks = (subtasks: Task[], parentPath: string) => {
    return (
      <List style={{backgroundColor:'#f7fafc'}}>
        {subtasks.map((subtask, index) => {
          const currentPath = `${parentPath}-${index}`;
          return (
            <div key={currentPath}>
              <ListItem style={{ marginLeft: `${(parentPath.split('-').length - 1) * 20}px` }}>
                <Checkbox
                  checked={subtask.completed}
                  onChange={() => toggleTaskCompletion(currentPath)}
                />
                <ListItemText
                  primary={subtask.text}
                  onClick={() => toggleSubtasks(currentPath)}
                />
                <IconButton onClick={() => deleteTask(currentPath)}>
                  <DeleteIcon />
                </IconButton>
                <Button onClick={() => addSubtask(currentPath)}>+</Button>
              </ListItem>
              <Collapse in={expandedPaths.includes(currentPath)}>
                {subtask.subtasks.length > 0 &&
                  renderSubtasks(subtask.subtasks, currentPath)}
              </Collapse>
            </div>
          );
        })}
      </List>
    );
  };

  return (
    <div style={{ marginLeft: '150px' }}>
      <h1 style={{color:'#7abdff'}}>Список задач</h1>
      <TextField
        label="Название задачи"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        style={{ marginBottom: '10px', width: '50%' }}
      />
      <TextField
        label="Описание"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        multiline
        rows={3}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <Button variant="contained" color="primary" onClick={addTask}>
        Добавить задачу
      </Button>

      <List>
        {tasks.map((task, index) => (
          <div key={index}>
            <ListItem style={{ backgroundColor: '#ddeeff', borderRadius: '10px', marginBottom:'10px'}}>
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index.toString())}
              />
              <ListItemText
                primary={task.text}
                onClick={() => toggleSubtasks(index.toString())}
              />
              <IconButton onClick={() => deleteTask(index.toString())}>
                <DeleteIcon />
              </IconButton>
              <Button onClick={() => addSubtask(index.toString())}>+</Button>
            </ListItem>
            <Collapse in={expandedPaths.includes(index.toString())}>
              {task.subtasks.length > 0 &&
                renderSubtasks(task.subtasks, index.toString())}
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );
}
