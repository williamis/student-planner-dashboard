console.log("Study Planner ready");

let deadlineChartInstance = null;
let tasksPerCourseChartInstance = null;
let doneVsTodoChartInstance = null; // uusi kaavio valmis/kesken

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

const filterCourse = document.getElementById("filter-course");
const filterStatus = document.getElementById("filter-status");

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
  refreshFilterCourse();
  updateDashboard();
}

// --- Kurssivalikon päivitys ---
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

function refreshFilterCourse() {
  if (!filterCourse) return;
  filterCourse.innerHTML = `<option value="">Kaikki kurssit</option>`;
  courses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    filterCourse.appendChild(opt);
  });
}

// --- Tehtävien näyttö ---
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = [...tasks];

  if (filterCourse && filterCourse.value) {
    filtered = filtered.filter(t => t.courseId === filterCourse.value);
  }

  if (filterStatus) {
    if (filterStatus.value === "done") {
      filtered = filtered.filter(t => t.done);
    } else if (filterStatus.value === "todo") {
      filtered = filtered.filter(t => !t.done);
    }
  }

  filtered.forEach(t => {
    const li = document.createElement("li");
    const courseName =
      courses.find(c => c.id === t.courseId)?.name || "Ei kurssia";

    li.innerHTML = `
      <input type="checkbox" data-toggle="${t.id}" ${t.done ? "checked" : ""} />
      <span style="text-decoration: ${t.done ? "line-through" : "none"}">
        ${t.title}
      </span>
      <span class="badge">${courseName}</span>
      <span class="badge">${t.deadline || "-"}</span>
      <button data-edit="${t.id}">Muokkaa</button>
      <button data-id="${t.id}">Poista</button>
    `;
    taskList.appendChild(li);
  });

  taskList.querySelectorAll("input[data-toggle]").forEach(cb =>
    cb.addEventListener("change", () => {
      const task = tasks.find(x => x.id === cb.dataset.toggle);
      if (task) {
        task.done = cb.checked;
        storage.write(STORAGE_KEYS.TASKS, tasks);
        renderTasks();
        updateDashboard();
      }
    })
  );

  taskList.querySelectorAll("button[data-id]").forEach(btn =>
    btn.addEventListener("click", () => {
      tasks = tasks.filter(x => x.id !== btn.dataset.id);
      storage.write(STORAGE_KEYS.TASKS, tasks);
      renderTasks();
      renderCalendar();
    })
  );

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
        renderCalendar();
      }
    })
  );

  updateDashboard();
}

// --- Tehtävän lisääminen ---
function addTask({ title, deadline, courseId }) {
  if (deadline && isNaN(new Date(deadline).getTime())) {
    alert("Anna validi päivämäärä (YYYY-MM-DD)");
    return;
  }

  const id = crypto.randomUUID();
  tasks.push({ id, title, deadline, courseId, done: false });
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

// --- Filtterit ---
if (filterCourse) filterCourse.addEventListener("change", renderTasks);
if (filterStatus) filterStatus.addEventListener("change", renderTasks);

// --- Dashboard ---
function updateDashboard() {
  const courseCountEl = document.getElementById("course-count");
  const taskCountEl = document.getElementById("task-count");
  const taskNoDeadlineEl = document.getElementById("task-no-deadline");

  if (!courseCountEl || !taskCountEl || !taskNoDeadlineEl) return;

  courseCountEl.textContent = `Kursseja yhteensä: ${courses.length}`;
  taskCountEl.textContent = `Tehtäviä yhteensä: ${tasks.length}`;
  const noDeadline = tasks.filter(t => !t.deadline).length;
  taskNoDeadlineEl.textContent = `Ilman deadlinea: ${noDeadline}`;

  // Graafi: deadline vs ei deadlinea
  const ctx = document.getElementById("deadlineChart");
  if (ctx) {
    if (deadlineChartInstance) deadlineChartInstance.destroy();

    const withDeadline = tasks.filter(t => t.deadline).length;
    const withoutDeadline = tasks.filter(t => !t.deadline).length;

    deadlineChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Deadline asetettu", "Ei deadlinea"],
        datasets: [{
          data: [withDeadline, withoutDeadline],
          backgroundColor: ["#36A2EB", "#FF6384"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }

  // Graafi: tehtävät per kurssi
  const ctx2 = document.getElementById("tasksPerCourseChart");
  if (ctx2) {
    if (tasksPerCourseChartInstance) tasksPerCourseChartInstance.destroy();

    const labels = courses.map(c => c.name);
    const data = courses.map(c => tasks.filter(t => t.courseId === c.id).length);

    tasksPerCourseChartInstance = new Chart(ctx2, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Tehtävät",
          data,
          backgroundColor: "#36A2EB"
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }

  // Graafi: valmiit vs kesken
  const ctx3 = document.getElementById("doneVsTodoChart");
  if (ctx3) {
    if (doneVsTodoChartInstance) doneVsTodoChartInstance.destroy();

    const done = tasks.filter(t => t.done).length;
    const todo = tasks.filter(t => !t.done).length;

    doneVsTodoChartInstance = new Chart(ctx3, {
      type: "doughnut",
      data: {
        labels: ["Valmis", "Kesken"],
        datasets: [{
          data: [done, todo],
          backgroundColor: ["#10B981", "#F59E0B"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }
}

// --- Kalenteri ---
let currentDate = new Date();

function renderCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("current-month");
  if (!calendarGrid || !monthLabel) return;

  calendarGrid.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthLabel.textContent = currentDate.toLocaleDateString("fi-FI", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.innerHTML = `<span class="date">${day}</span>`;

    tasks
      .filter(t => t.deadline && new Date(t.deadline).toDateString() === date.toDateString())
      .forEach(t => {
        const taskEl = document.createElement("div");
        taskEl.className = "calendar-task";
        taskEl.textContent = t.title;
        div.appendChild(taskEl);
      });

    calendarGrid.appendChild(div);
  }
}

document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
// --- Export JSON ---
document.getElementById("export-json").addEventListener("click", () => {
  const data = { courses, tasks };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "studyplanner-data.json";
  a.click();

  URL.revokeObjectURL(url);
});

// --- Import JSON ---
document.getElementById("import-json").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.courses && data.tasks) {
        courses = data.courses;
        tasks = data.tasks;
        storage.write(STORAGE_KEYS.COURSES, courses);
        storage.write(STORAGE_KEYS.TASKS, tasks);

        refreshCourseSelect();
        refreshFilterCourse();
        renderCourses();
        renderTasks();
        updateDashboard();
        renderCalendar();

        alert("Data tuotu onnistuneesti!");
      } else {
        alert("Virheellinen JSON-muoto.");
      }
    } catch {
      alert("Virhe JSON-tiedoston lukemisessa.");
    }
  };
  reader.readAsText(file);
});


// --- Alustus ---
refreshCourseSelect();
refreshFilterCourse();
renderCourses();
renderTasks();
updateDashboard();
renderCalendar();
