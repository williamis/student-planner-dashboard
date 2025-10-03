console.log("Study Planner ready");

// --- Tallennuskerros ---
const STORAGE_KEYS = { COURSES: "sp_courses", TASKS: "sp_tasks" };

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
let tasks = storage.read(STORAGE_KEYS.TASKS);
// --- UI-elementit ---
const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("course-list");
const courseName = document.getElementById("course-name");
const courseCode = document.getElementById("course-code");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskTitle = document.getElementById("task-title");
const taskDeadline = document.getElementById("task-deadline");
const taskCourseSelect = document.getElementById("task-course");


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
    li.innerHTML = `
      <span>${c.name} (${c.code})</span>
      <button data-edit="${c.id}">Muokkaa</button>
      <button data-id="${c.id}">Poista</button>
    `;
    courseList.appendChild(li);
  });

  // Poisto
  courseList.querySelectorAll("button[data-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      courses = courses.filter(x => x.id !== btn.dataset.id);
      storage.write(STORAGE_KEYS.COURSES, courses);
      renderCourses();
    })
  );

  // Muokkaus
  courseList.querySelectorAll("button[data-edit]").forEach(btn =>
    btn.addEventListener("click", () => {
      const course = courses.find(x => x.id === btn.dataset.edit);
      if (!course) return;

      const newName = prompt("Anna uusi nimi:", course.name);
      const newCode = prompt("Anna uusi koodi:", course.code);

      if (newName !== null) {
        course.name = newName.trim();
        course.code = newCode.trim();
        storage.write(STORAGE_KEYS.COURSES, courses);
        renderCourses();
      }
    })
  );

  // Päivitä kurssi-dropdown kun kurssilista muuttuu
  refreshCourseSelect();
}

// --- Kurssivalikon päivitys tehtäviä varten ---
function refreshCourseSelect() {
  if (!taskCourseSelect) return; // varmistus jos lomaketta ei ole
  taskCourseSelect.innerHTML = `<option value="">(valitse kurssi)</option>`;
  courses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    taskCourseSelect.appendChild(opt);
  });
}
refreshCourseSelect();

