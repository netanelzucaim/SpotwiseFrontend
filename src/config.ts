export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
// process.env.HUGGING_API_KEY - when running at production retrieve from env
export const HUGGING_API_KEY = import.meta.env.VITE_HUGGING_API_KEY || process.env.HUGGING_API_KEY;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
