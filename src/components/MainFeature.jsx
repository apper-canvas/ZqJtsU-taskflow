import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, AlertCircle } from "lucide-react";

const MainFeature = ({ onAddTask }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "active",
    createdAt: new Date().toISOString()
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "active",
        createdAt: new Date().toISOString()
      });
      setErrors({});
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onAddTask({
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      // Reset form and close
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "active",
        createdAt: new Date().toISOString()
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card overflow-hidden"
      >
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Task</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleForm}
              className={`btn ${isFormOpen ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
            >
              {isFormOpen ? (
                <>
                  <X size={18} />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>New Task</span>
                </>
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Task Title <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`input ${errors.title ? 'border-secondary' : ''}`}
                      placeholder="What needs to be done?"
                      autoFocus
                    />
                    {errors.title && (
                      <div className="mt-1 text-sm text-secondary flex items-center gap-1">
                        <AlertCircle size={14} />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`input min-h-[100px] ${errors.description ? 'border-secondary' : ''}`}
                      placeholder="Add details about your task..."
                    ></textarea>
                    {errors.description && (
                      <div className="mt-1 text-sm text-secondary flex items-center gap-1">
                        <AlertCircle size={14} />
                        <span>{errors.description}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <div className="flex gap-3">
                      {["low", "medium", "high"].map((priority) => (
                        <label 
                          key={priority}
                          className={`
                            flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                            ${formData.priority === priority 
                              ? `bg-${priority === 'high' ? 'secondary' : priority === 'medium' ? 'accent' : 'primary'}/10 border-${priority === 'high' ? 'secondary' : priority === 'medium' ? 'accent' : 'primary'}`
                              : 'border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={formData.priority === priority}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="capitalize">{priority}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={toggleForm}
                      className="btn btn-outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-primary relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </span>
                      ) : (
                        <span>Create Task</span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-surface-600 dark:text-surface-400 text-sm"
            >
              <p>Click the button above to create a new task with title, description, and priority level.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;