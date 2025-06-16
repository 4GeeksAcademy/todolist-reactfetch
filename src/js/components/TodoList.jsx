import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty-state">No hay tareas, añade algunas</p>;
  }
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
      <li className="todo-footer">
        {todos.length} {todos.length > 1 ? 'tareas pendientes' : 'tarea pendiente'}
      </li>
    </ul>
  );
}
