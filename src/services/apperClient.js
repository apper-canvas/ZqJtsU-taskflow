/**
 * Initialize and export the ApperClient instance for use throughout the application
 */

// Canvas ID from environment
const CANVAS_ID = "09ce110c47cc4562a4e0500f8411a125";

// Get the ApperClient from the global window object
let apperClient = null;

// Initialize the ApperClient instance
const initializeClient = () => {
  if (!window.ApperSDK) {
    console.error("Apper SDK not loaded. Please check your internet connection.");
    return null;
  }
  
  const { ApperClient } = window.ApperSDK;
  apperClient = new ApperClient(CANVAS_ID);
  return apperClient;
};

// Export a function to get or initialize the client
export const getApperClient = () => {
  if (!apperClient) {
    return initializeClient();
  }
  return apperClient;
};

// Export the ApperUI component for authentication
export const getApperUI = () => {
  if (!window.ApperSDK) {
    console.error("Apper SDK not loaded. Please check your internet connection.");
    return null;
  }
  
  return window.ApperSDK.ApperUI;
};

// Export the Canvas ID for use in other parts of the application
export const getCanvasId = () => CANVAS_ID;