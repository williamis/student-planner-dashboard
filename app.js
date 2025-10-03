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
// --- UI-elementit ---
const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("course-list");
const courseName = document.getElementById("course-name");
const courseCode = document.getElementById("course-code");

// --- Kurssin lisääminen ---
function addCourse({ name, code }) {
  const id = crypto.randomUUID();
  courses.push({ id, name, code });
  storage.write(STORAGE_KEYS.COURSES, courses);
  renderCourses();
}

courseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = courseName.value.trim();
  const code = courseCode.value.trim();
  if (!name) return;
  addCourse({ name, code });
  courseForm.reset();
});

// --- Kurssien näyttö ---
function renderCourses() {
  courseList.innerHTML = "";
  courses.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.name} (${c.code})`;
    courseList.appendChild(li);
  });
}
renderCourses();
