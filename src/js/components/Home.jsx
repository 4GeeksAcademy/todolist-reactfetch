// src/js/components/Home.jsx
import React, { useState, useEffect } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

const USER    = 'alesanchezr';
const API_URL = `https://playground.4geeks.com/todos/${USER}`;

export default function Home() {
  const [todos,   setTodos]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Inicializa el usuario (POST []) o carga lista si ya existe
  useEffect(() => {
    const init = async () => {
      try {
        // Intentamos un GET rápido para ver si existe
        const resp = await fetch(API_URL);
        if (!resp.ok) {
          // Si no existe (404 o 405), lo creamos
          await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
          });
          setTodos([]);
          return;
        }
        // Si existe, cargamos la lista
        const data = await resp.json();
        setTodos(data);
      } catch (err) {
        console.error('Error init:', err);
        setTodos([]); // incluso si da error, arrancamos con vacío
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Añade una tarea y usa el array que devuelva el POST
  const addTodo = async texto => {
    setLoading(true);
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: texto, done: false })
      });
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      setTodos(data);
    } catch (err) {
      console.error('Error al añadir:', err);
    } finally {
      setLoading(false);
    }
  };

  // Borra una tarea y usa el array que devuelva el DELETE
  const deleteTodo = async id => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      setTodos(data);
    } catch (err) {
      console.error('Error al borrar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Borra todas las tareas de golpe
  const clearTodos = async () => {
    setLoading(true);
    try {
      const resp = await fetch(API_URL, { method: 'DELETE' });
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      setTodos(data);
    } catch (err) {
      console.error('Error al vaciar lista:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todo-app">
      <h1>tareas</h1>
      <TodoInput onAdd={addTodo} />

      {loading
        ? <p>Cargando tareas…</p>
        : (
          <>
            <TodoList todos={todos} onDelete={deleteTodo} />
            {todos.length > 0 && (
              <button className="clear-all-btn" onClick={clearTodos}>
                Eliminar todas las tareas
              </button>
            )}
          </>
        )
      }
    </div>
  );
}
