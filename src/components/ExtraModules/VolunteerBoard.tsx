import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Check, Trash2, Plus, Send } from 'lucide-react';
import { 
  db, collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from '../../firebase';

export const VolunteerBoard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Sector E (East Wing)');
  const [urgency, setUrgency] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'volunteer_tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setTasks(list);
    });
    return unsub;
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'volunteer_tasks'), {
        title,
        location,
        urgency,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTask = async (id: string) => {
    try {
      await updateDoc(doc(db, 'volunteer_tasks', id), { status: 'completed' });
    } catch (err) {
      console.error('Error resolving task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'volunteer_tasks', id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[600px]">
      <div className="xl:col-span-2 glass-card p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-neon-blue-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-lg text-white">Active Maintenance Work Orders</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-neon-blue-500/10 border border-neon-blue-500/30 text-[9px] font-mono text-neon-blue-400 uppercase font-bold">
            Live Link Active
          </span>
        </div>

        <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === 'completed' 
                      ? 'bg-void-950/40 border-void-600/10 opacity-50' 
                      : 'bg-void-900 border-void-600/30 shadow-md hover:border-void-500'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          task.urgency === 'high' ? 'bg-state-danger-bg/25 text-state-danger-text border-state-danger-text/20' :
                          task.urgency === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                          'bg-void-800 text-void-400 border-void-700/30'
                        }`}>
                          {task.urgency} priority
                        </span>
                        <span className="text-[10px] text-void-500 font-mono">
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold ${task.status === 'completed' ? 'line-through text-void-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-void-400 mt-1 font-mono">{task.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleResolveTask(task.id)}
                          className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                          title="Complete Task"
                          aria-label="Complete task"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        title="Delete Task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-void-600">
                <ClipboardList className="w-12 h-12 opacity-25 mb-3" aria-hidden="true" />
                <p className="text-xs uppercase font-mono tracking-widest font-bold">No standby steward tasks</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-5 h-5 text-neon-blue-400" aria-hidden="true" />
            <h3 className="font-display font-bold text-base text-white">Create Work Order</h3>
          </div>
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Task Description</label>
              <input
                id="task-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inspect Compressor C-204 lube..."
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white placeholder:text-void-600 focus:outline-none focus:border-neon-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="task-location" className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Plant Location</label>
              <select
                id="task-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-void-950 border border-void-600/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-blue-500 transition-colors"
              >
                <option value="Sector E (East Wing)">Sector E (East Wing)</option>
                <option value="Sector W (West Wing)">Sector W (West Wing)</option>
                <option value="Sector N (North Wing)">Sector N (North Wing)</option>
                <option value="Sector S (South Wing)">Sector S (South Wing)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-void-300 uppercase tracking-wider mb-1.5">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Urgency level">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 rounded-lg font-mono text-[10px] uppercase border transition-all ${
                      urgency === level 
                        ? 'bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500 shadow-neon-glow-blue' 
                        : 'bg-void-900 border-void-700/50 text-void-400 hover:border-void-600'
                    }`}
                    role="radio"
                    aria-checked={urgency === level}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-neon-blue-600 hover:bg-neon-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-neon-glow-blue cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              Dispatch Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
