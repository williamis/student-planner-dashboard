console.log("Study Planner ready");

let chartDoneVsTodo;
let chartTasksPerCourse;

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

  refreshCourseSelect();
  updateDashboard(); // Päivitä dashboard
}

// --- Kurssivalikon päivitys tehtäviä varten ---
function refreshCourseSelect() {
  if (!taskCourseSelect) return;
  taskCourseSelect.innerHTML = `<option value="">(valitse kurssi)</option>`;
  courses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    taskCourseSelect.appendChild(opt);
  });
}

// --- Tehtävien näyttö ---
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    const courseName =
      courses.find(c => c.id === t.courseId)?.name || "Ei kurssia";

    li.innerHTML = `
      <span>${t.title}</span>
      <span class="badge">${courseName}</span>
      <span class="badge">${t.deadline || "-"}</span>
      <button data-edit="${t.id}">Muokkaa</button>
      <button data-id="${t.id}">Poista</button>
    `;
    taskList.appendChild(li);
  });

  // Poisto
  taskList.querySelectorAll("button[data-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      tasks = tasks.filter(x => x.id !== btn.dataset.id);
      storage.write(STORAGE_KEYS.TASKS, tasks);
      renderTasks();
    })
  );

  // Muokkaus
  taskList.querySelectorAll("button[data-edit]").forEach(btn =>
    btn.addEventListener("click", () => {
      const task = tasks.find(x => x.id === btn.dataset.edit);
      if (!task) return;

      const newTitle = prompt("Anna uusi otsikko:", task.title);
      const newDeadline = prompt("Anna uusi deadline (vvvv-kk-pp):", task.deadline);

      if (newTitle !== null) {
        task.title = newTitle.trim();
        task.deadline = newDeadline.trim();
        storage.write(STORAGE_KEYS.TASKS, tasks);
        renderTasks();
      }
    })
  );

  updateDashboard(); // Päivitä dashboard
}

// --- Tehtävän lisääminen ---
function addTask({ title, deadline, courseId }) {
  const id = crypto.randomUUID();
  tasks.push({ id, title, deadline, courseId });
  storage.write(STORAGE_KEYS.TASKS, tasks);
  renderTasks();
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const deadline = taskDeadline.value;
  const courseId = taskCourseSelect.value;
  if (!title) return;
  addTask({ title, deadline, courseId });
  taskForm.reset();
});

// --- Dashboardin päivitys ---
function updateDashboard() {
  const ctx1 = document.getElementById("chart-done-vs-todo").getContext("2d");
  const ctx2 = document.getElementById("chart-tasks-per-course").getContext("2d");

  // Lasketaan tehtävät
  const done = tasks.filter(t => t.done).length;
  const todo = tasks.filter(t => !t.done).length;

  // Doughnut (done vs todo)
  if (chartDoneVsTodo) chartDoneVsTodo.destroy();
  chartDoneVsTodo = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Tehdyt", "Tekemättä"],
      datasets: [{
        data: [done, todo],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    }
  });

  // Bar (tehtävät per kurssi)
  const courseNames = courses.map(c => c.name);
  const taskCounts = courses.map(c => tasks.filter(t => t.courseId === c.id).length);

  if (chartTasksPerCourse) chartTasksPerCourse.destroy();
  chartTasksPerCourse = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: courseNames,
      datasets: [{
        label: "Tehtävien määrä",
        data: taskCounts,
        backgroundColor: "#2196f3"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// --- Alustetaan näkymä ---
refreshCourseSelect();
renderCourses();
renderTasks();
updateDashboard();
