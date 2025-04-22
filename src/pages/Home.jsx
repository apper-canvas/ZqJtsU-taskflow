import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, SortAsc, SortDesc } from "lucide-react";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }]);
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === "completed" ? "active" : "completed" } 
        : task
    ));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Organize Your Tasks
          </h1>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Create, manage, and track your tasks with our intuitive interface. Stay productive and never miss a deadline.
          </p>
        </motion.div>
        
        <MainFeature onAddTask={addTask} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  className="btn btn-outline flex items-center gap-1"
                  onClick={() => {
                    const newFilter = filter === "all" 
                      ? "active" 
                      : filter === "active" 
                        ? "completed" 
                        : "all";
                    setFilter(newFilter);
                  }}
                >
                  <Filter size={16} />
                  <span className="capitalize">{filter}</span>
                </button>
              </div>
              
              <button 
                className="btn btn-outline flex items-center gap-1"
                onClick={toggleSortOrder}
              >
                {sortOrder === "asc" ? (
                  <>
                    <SortAsc size={16} />
                    <span>Oldest</span>
                  </>
                ) : (
                  <>
                    <SortDesc size={16} />
                    <span>Newest</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`card p-4 task-item priority-${task.priority}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 
                            className={`font-medium text-lg ${
                              task.status === "completed" 
                                ? "line-through text-surface-400 dark:text-surface-500" 
                                : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === "high" 
                                ? "bg-secondary/10 text-secondary" 
                                : task.priority === "medium"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-primary/10 text-primary"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 mt-1">
                          {task.description}
                        </p>
                        <div className="mt-2 text-sm text-surface-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="btn btn-outline py-1 px-3"
                        >
                          {task.status === "completed" ? "Undo" : "Complete"}
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="btn btn-outline py-1 px-3 text-secondary"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 text-surface-500"
                >
                  <p>No tasks found. Create your first task above!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;