import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import * as S from './Styles';
import { Trash2, CheckCircle, Circle, Plus, AlertCircle, X, Calendar, Edit3 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks which task is being edited

  // Form States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');

  // READ: Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Logical Status Helper
  const getStatus = (dateString, completed) => {
    if (completed) return { text: "Completed", color: "#10b981", isOverdue: false };
    if (!dateString) return { text: "No Deadline", color: "#64748b", isOverdue: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: "OVERDUE", color: "#ef4444", isOverdue: true };
    if (diff === 0) return { text: "Due Today", color: "#f59e0b", isOverdue: false };
    return { text: `${diff} Days Left`, color: "#3b82f6", isOverdue: false };
  };

  // Open Modal for Editing
  const handleEditClick = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDesc(task.description);
    setDueDate(task.dueDate);
    setIsModalOpen(true);
  };

  // Reset Form and Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setDesc(''); setDueDate('');
  };

  // CREATE or UPDATE handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description: desc,
      dueDate,
    };

    if (editingId) {
      // UPDATE existing task
      await updateDoc(doc(db, 'tasks', editingId), taskData);
    } else {
      // CREATE new task
      await addDoc(collection(db, 'tasks'), {
        ...taskData,
        completed: false,
        createdAt: serverTimestamp()
      });
    }
    closeModal();
  };

  return (
    <S.Container style={{ background: '#05070a', padding: '40px' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>Task<span style={{ color: '#3b82f6' }}>Hub</span></h1>
          <p style={{ color: '#64748b' }}>Manage your workspace professionally</p>
        </div>
        <S.Button onClick={() => setIsModalOpen(true)} style={{ height: '50px', borderRadius: '12px', padding: '0 25px' }}>
          <Plus size={20} style={{ marginRight: '8px' }} /> Create New
        </S.Button>
      </div>

      {/* TASK GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '25px', 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <AnimatePresence>
          {tasks.map(task => {
            const status = getStatus(task.dueDate, task.completed);
            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  background: '#111827',
                  borderRadius: '20px',
                  padding: '24px',
                  borderLeft: `8px solid ${status.color}`,
                  boxShadow: status.isOverdue ? '0 0 20px rgba(239, 68, 68, 0.25)' : '0 10px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: task.completed ? '#4b5563' : '#fff', textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    <div onClick={() => updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed })} style={{ cursor: 'pointer' }}>
                      {task.completed ? <CheckCircle color="#10b981" size={24} /> : <Circle color="#374151" size={24} />}
                    </div>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.6' }}>{task.description}</p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: status.color, fontWeight: '700', fontSize: '0.85rem' }}>
                    {status.isOverdue ? <AlertCircle size={16} /> : <Calendar size={16} />}
                    {status.text}
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <Edit3 size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => handleEditClick(task)} />
                    <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => deleteDoc(doc(db, 'tasks', task.id))} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* MODAL POPUP (SHARED FOR ADD/EDIT) */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#111827', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '500px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, color: '#fff' }}>{editingId ? 'Update Project' : 'New Project'}</h2>
                <X onClick={closeModal} style={{ cursor: 'pointer', color: '#64748b' }} />
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Task Name</label>
                  <S.Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter title..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Deadline</label>
                  <S.Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Description</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Add details..." style={{ background: '#1f2937', color: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #374151', height: '120px', fontFamily: 'inherit' }} />
                </div>
                <S.Button type="submit" style={{ marginTop: '10px', height: '55px', justifyContent: 'center' }}>
                  {editingId ? 'Save Changes' : 'Create Task'}
                </S.Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </S.Container>
  );
}

export default App;