import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { login, selectAuthStatus } from "../store/authSlice";

const AuthenticationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  
  useEffect(() => {
    // When the modal is opened, try to log in
    if (isOpen) {
      dispatch(login())
        .unwrap()
        .then(() => {
          // Close the modal on successful login
          onClose();
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    }
  }, [dispatch, isOpen, onClose]);
  
  // Close the modal if auth status becomes successful
  useEffect(() => {
    if (authStatus === 'succeeded' && isOpen) {
      onClose();
    }
  }, [authStatus, isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative bg-white dark:bg-surface-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="absolute top-3 right-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Authentication
              </h2>
              
              <div id="authentication" className="min-h-[300px]">
                {/* ApperUI will render login UI here */}
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthenticationModal;