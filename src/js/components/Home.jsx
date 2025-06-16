// src/js/components/Home.jsx
import React, { useState, useEffect } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

const USER             = 'CarlosAguayo1';
const URL_USER         = `https://playground.4geeks.com/todo/users/${USER}`;
const URL_TODOS_BY_USER= `https://playground.4geeks.com/todo/todos/${USER}`;
const URL_TODO         = `https://playground.4geeks.com/todo/todos`;

export default function Home() {
  const [todos,   setTodos]   = useState([]);
  const [loading, setLoading] = useState(true);

  
  const initAndFetch = async () => {
    try {
      setLoading(true);

      
      const resUser = await fetch(URL_USER);
      if (!resUser.ok) {
        
        await fetch(URL_TODOS_BY_USER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        });
        setTodos([]);
        return;
      }

      
      const { todos: lista } = await resUser.json();
      setTodos(lista);
    } catch (err) {
      console.error('Error iniciando o cargando tareas:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  
  const addTodo = async texto => {
    try {
      setLoading(true);
      await fetch(URL_TODOS_BY_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: texto, done: false })
      });
      
      await initAndFetch();
    } catch (err) {
      console.error('Error añadiendo tarea:', err);
    } finally {
      setLoading(false);
    }
  };

 
  const deleteTodo = async id => {
    try {
      setLoading(true);
      await fetch(`${URL_TODO}/${id}`, { method: 'DELETE' });
      
      await initAndFetch();
    } catch (err) {
      console.error('Error borrando tarea:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const clearTodos = async () => {
    try {
      setLoading(true);
      
      await Promise.all(
        todos.map(t => fetch(`${URL_TODO}/${t.id}`, { method: 'DELETE' }))
      );
      setTodos([]);
    } catch (err) {
      console.error('Error borrando todas las tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    initAndFetch();
  }, []);

  return (
    <div className="todo-app">
      <h1>Tareas</h1>
      <TodoInput onAdd={addTodo} />

      {loading
        ? <p>Cargando tareas…</p>
        : (
          <>
            <TodoList todos={todos} onDelete={deleteTodo} />
            {todos.length > 0 && (
              <button 
                className="clear-all-btn" 
                onClick={clearTodos}
              >
                Eliminar todas las tareas
              </button>
            )}
          </>
        )
      }
    </div>
  );
}
