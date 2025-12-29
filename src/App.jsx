import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import * as S from './Styles'; // Import all styled components
import { Trash2, CheckCircle, Circle } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // READ (Real-time)
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // CREATE
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(db, 'tasks'), {
      text: input,
      completed: false,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  // UPDATE
  const toggleTask = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
  };

  // DELETE
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <S.Container>
      <h1 style={{ marginBottom: '5px' }}>Task Manager</h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Firebase CRUD Project</p>
      
      <S.Card>
        <S.InputGroup onSubmit={handleAdd}>
          <S.Input 
            placeholder="Add a new task..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <S.Button type="submit">Add</S.Button>
        </S.InputGroup>

        {tasks.map(task => (
          <S.TaskRow key={task.id} completed={task.completed}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div onClick={() => toggleTask(task)} style={{ cursor: 'pointer' }}>
                {task.completed ? <CheckCircle color="#10b981" /> : <Circle color="#475569" />}
              </div>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#64748b' : 'white' }}>
                {task.text}
              </span>
            </div>
            <Trash2 
              size={18} 
              color="#ef4444" 
              style={{ cursor: 'pointer', opacity: 0.7 }} 
              onClick={() => deleteTask(task.id)}
            />
          </S.TaskRow>
        ))}
      </S.Card>
    </S.Container>
  );
}

export default App;