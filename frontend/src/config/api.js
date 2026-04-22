// API configuration - works in both dev and production
export const getAPIUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:4000";
};

export const API_ENDPOINTS = {
  GET_EVENTS: () => `${getAPIUrl()}/api/events`,
  CREATE_EVENT: () => `${getAPIUrl()}/api/events`,
  DELETE_EVENTS: () => `${getAPIUrl()}/api/events`,
  
  // AI Endpoints
  GENERATE_DESCRIPTION: () => `${getAPIUrl()}/api/ai/generate-description`,
  AI_CHAT: () => `${getAPIUrl()}/api/ai/chat`,
  RECOMMEND_EVENTS: () => `${getAPIUrl()}/api/ai/recommend-events`,
};
