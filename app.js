// State Management
const initialState = {
    students: [
        { id: 1, name: "Emma Smith", grade: "10th", email: "emma.s@example.com", status: "Active" },
        { id: 2, name: "Liam Johnson", grade: "12th", email: "liam.j@example.com", status: "Active" },
        { id: 3, name: "Olivia Williams", grade: "9th", email: "olivia.w@example.com", status: "Inactive" },
    ],
    teachers: [
        { id: 1, name: "Mr. Robert Brown", subject: "Mathematics", email: "robert.b@eduprime.com" },
        { id: 2, name: "Ms. Sarah Davis", subject: "Science", email: "sarah.d@eduprime.com" },
    ]
};

// App Data
let appData = {
    students: [],
    teachers: []
};

// DOM Elements
const contentArea = document.getElementById('content-area');
const pageHeader = document.getElementById('page-header');
const navItems = document.querySelectorAll('.nav-item');
const currentDateEl = document.getElementById('current-date');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-modal');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    updateDate();
    renderDashboard(); // Default view
});

// Navigation Logic
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');

            const view = item.dataset.view;
            handleViewChange(view);

            // Close sidebar on mobile when item clicked
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
}

function handleViewChange(view) {
    // smooth transition
    contentArea.style.opacity = 0;

    setTimeout(() => {
        switch (view) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'students':
                renderStudents();
                break;
            case 'teachers':
                renderTeachers();
                break;
            case 'settings':
                renderSettings();
                break;
        }
        contentArea.style.opacity = 1;
    }, 200);
}

// Data Handling
function loadData() {
    const savedData = localStorage.getItem('schoolAppData');
    if (savedData) {
        appData = JSON.parse(savedData);
    } else {
        appData = getInitialData();
        saveData();
    }
}

function getInitialData() {

    return JSON.parse(JSON.stringify(initialState));
}

function saveData() {
    localStorage.setItem('schoolAppData', JSON.stringify(appData));
}

// Views rendering
function renderDashboard() {
    pageHeader.textContent = 'Dashboard';

    const totalStudents = appData.students.length;
    const totalTeachers = appData.teachers.length;
    const activeStudents = appData.students.filter(s => s.status === 'Active').length;

    contentArea.innerHTML = `
        <div class="dashboard-grid animate-fade-in">
            <div class="stat-card">
                <div class="stat-info">
                    <span class="label">Total Students</span>
                    <span class="value">${totalStudents}</span>
                </div>
                <div class="stat-icon bg-indigo">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span class="label">Total Teachers</span>
                    <span class="value">${totalTeachers}</span>
                </div>
                <div class="stat-icon bg-green">
                    <i class="fa-solid fa-chalkboard-user"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span class="label">Active Students</span>
                    <span class="value">${activeStudents}</span>
                </div>
                <div class="stat-icon bg-orange">
                    <i class="fa-solid fa-users"></i>
                </div>
            </div>
        </div>

        <div class="table-container animate-fade-in">
            <div class="section-header">
                <h2>Recent Students</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${appData.students.slice(0, 5).map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.grade}</td>
                            <td><span class="badge ${student.status === 'Active' ? 'badge-success' : 'badge-warning'}">${student.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderStudents() {
    pageHeader.textContent = 'Students';

    const rows = appData.students.map(student => `
        <tr>
            <td>
                <div style="font-weight: 500;">${student.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${student.email}</div>
            </td>
            <td>${student.grade}</td>
            <td><span class="badge ${student.status === 'Active' ? 'badge-success' : 'badge-warning'}">${student.status}</span></td>
            <td>
                <button class="action-btn delete" onclick="deleteStudent(${student.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    contentArea.innerHTML = `
        <div class="table-container animate-fade-in">
            <div class="section-header">
                <h2>All Students</h2>
                <button class="btn-primary" onclick="openAddStudentModal()">
                    <i class="fa-solid fa-plus"></i> Add Student
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.length ? rows : '<tr><td colspan="4" style="text-align:center;">No students found</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderTeachers() {
    pageHeader.textContent = 'Teachers';

    const rows = appData.teachers.map(teacher => `
        <tr>
            <td>
                <div style="font-weight: 500;">${teacher.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${teacher.email}</div>
            </td>
            <td>${teacher.subject}</td>
            <td>
                <button class="action-btn delete" onclick="deleteTeacher(${teacher.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    contentArea.innerHTML = `
        <div class="table-container animate-fade-in">
            <div class="section-header">
                <h2>Faculty Members</h2>
                <button class="btn-primary" onclick="openAddTeacherModal()">
                    <i class="fa-solid fa-plus"></i> Add Teacher
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                     ${rows.length ? rows : '<tr><td colspan="3" style="text-align:center;">No teachers found</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderSettings() {
    pageHeader.textContent = 'Settings';
    contentArea.innerHTML = `
        <div class="table-container animate-fade-in">
            <h2>System Settings</h2>
            <p style="color: var(--text-muted); margin-top: 10px;">System version 1.0.0</p>
            <button class="btn-secondary" style="margin-top: 20px; color: var(--danger); border-color: var(--danger);" onclick="resetData()">
                Reset Data
            </button>
        </div>
    `;
}

// Modal Logic
function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

// Specific Modals
window.openAddStudentModal = function () {
    const formHtml = `
        <form id="add-student-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Grade/Class</label>
                <input type="text" name="grade" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status" class="form-control">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save Student</button>
            </div>
        </form>
    `;

    openModal('Add New Student', formHtml);

    document.getElementById('add-student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newStudent = {
            id: Date.now(),
            name: formData.get('name'),
            grade: formData.get('grade'),
            email: formData.get('email'),
            status: formData.get('status')
        };

        appData.students.push(newStudent);
        saveData();
        closeModal();
        renderStudents();
    });
};

window.openAddTeacherModal = function () {
    const formHtml = `
        <form id="add-teacher-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" name="subject" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save Teacher</button>
            </div>
        </form>
    `;

    openModal('Add New Teacher', formHtml);

    document.getElementById('add-teacher-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newTeacher = {
            id: Date.now(),
            name: formData.get('name'),
            subject: formData.get('subject'),
            email: formData.get('email')
        };

        appData.teachers.push(newTeacher);
        saveData();
        closeModal();
        renderTeachers();
    });
};

window.deleteStudent = function (id) {
    if (confirm('Are you sure you want to delete this student?')) {
        appData.students = appData.students.filter(s => s.id !== id);
        saveData();
        renderStudents();
    }
};

window.deleteTeacher = function (id) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        appData.teachers = appData.teachers.filter(t => t.id !== id);
        saveData();
        renderTeachers();
    }
};

window.resetData = function () {
    if (confirm('This will reset all data to default. Continue?')) {
        appData = getInitialData();
        saveData();
        renderSettings();
    }
};

// Utilities
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    currentDateEl.textContent = date;
}
