console.log("Study Planner ready");

// --- Tallennuskerros ---
const STORAGE_KEYS = { COURSES: "sp_courses" };

const storage = {
  read(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Data
let courses = storage.read(STORAGE_KEYS.COURSES);
