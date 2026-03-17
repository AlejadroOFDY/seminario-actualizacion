const STORAGE_KEY = "tp3_students";

const addNameInput = document.getElementById("add-student-name-input");
const addAgeInput = document.getElementById("add-student-age-input");
const addGradeInput = document.getElementById("add-student-grade-input");

const editNameInput = document.getElementById("edit-student-name-input");
const editAgeInput = document.getElementById("edit-student-age-input");
const editGradeInput = document.getElementById("edit-student-grade-input");

const saveStudentBtn = document.getElementById("save-student-btn");
const saveEditBtn = document.getElementById("save-edit-btn");
const deleteStudentsBtn = document.getElementById("delete-students-btn");

const editStudentList = document.getElementById("edit-student-list");
const deleteStudentList = document.getElementById("delete-student-list");
const studentsMasterList = document.getElementById("students-master-list");

let students = [];
let selectedEditIndex = null;

students = loadStudents();
saveStudents();

function loadStudents() {
	const saved = localStorage.getItem(STORAGE_KEY);

	if (!saved) {
		return [];
	}

	try {
		const parsed = JSON.parse(saved);

		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed
			.map((student) => normalizeStudent(student))
			.filter((student) => student !== null);
	} catch (error) {
		return [];
	}
}

function normalizeStudent(student) {
	if (typeof student === "string") {
		const name = student.trim();
		return name ? { name, age: "", grade: "" } : null;
	}

	if (!student || typeof student !== "object") {
		return null;
	}

	const name = String(student.name ?? "").trim();
	const age = String(student.age ?? "").trim();
	const grade = String(student.grade ?? "").trim();

	if (!name) {
		return null;
	}

	return { name, age, grade };
}

function saveStudents() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function createEmptyStateItem(message) {
	const li = document.createElement("li");
	li.className = "empty-state";
	li.textContent = message;
	return li;
}

function renderMasterList() {
	studentsMasterList.innerHTML = "";

	if (!students.length) {
		studentsMasterList.appendChild(createEmptyStateItem("No hay estudiantes cargados."));
		return;
	}

	students.forEach((student) => {
		studentsMasterList.appendChild(createStudentDataItem(student));
	});
}

function renderEditList() {
	editStudentList.innerHTML = "";

	if (!students.length) {
		selectedEditIndex = null;
		clearEditInputs();
		editStudentList.appendChild(createEmptyStateItem("No hay estudiantes para editar."));
		return;
	}

	if (selectedEditIndex !== null && selectedEditIndex >= students.length) {
		selectedEditIndex = null;
		clearEditInputs();
	}

	students.forEach((student, index) => {
		const li = createStudentDataItem(student);
		li.className = index === selectedEditIndex ? "selected" : "";
		li.addEventListener("click", () => {
			selectedEditIndex = index;
			editNameInput.value = students[index].name;
			editAgeInput.value = students[index].age;
			editGradeInput.value = students[index].grade;
			renderEditList();
		});
		editStudentList.appendChild(li);
	});
}

function renderDeleteList() {
	deleteStudentList.innerHTML = "";

	if (!students.length) {
		deleteStudentList.appendChild(createEmptyStateItem("No hay estudiantes para eliminar."));
		return;
	}

	students.forEach((student, index) => {
		const li = document.createElement("li");
		li.className = "delete-item";

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = `delete-student-${index}`;
		checkbox.value = String(index);

		const label = document.createElement("label");
		label.htmlFor = checkbox.id;
		label.textContent = `${student.name} | Edad: ${student.age || "-"} | Nota: ${student.grade || "-"}`;

		li.appendChild(checkbox);
		li.appendChild(label);
		deleteStudentList.appendChild(li);
	});
}

function createStudentDataItem(student) {
	const li = document.createElement("li");

	const nameCell = document.createElement("span");
	nameCell.textContent = student.name;

	const ageCell = document.createElement("span");
	ageCell.className = "cell-number";
	ageCell.textContent = student.age || "-";

	const gradeCell = document.createElement("span");
	gradeCell.className = "cell-number";
	gradeCell.textContent = student.grade || "-";

	li.appendChild(nameCell);
	li.appendChild(ageCell);
	li.appendChild(gradeCell);

	return li;
}

function clearAddInputs() {
	addNameInput.value = "";
	addAgeInput.value = "";
	addGradeInput.value = "";
}

function clearEditInputs() {
	editNameInput.value = "";
	editAgeInput.value = "";
	editGradeInput.value = "";
}

function readStudentFormValues(nameInput, ageInput, gradeInput) {
	const name = nameInput.value.trim();
	const ageText = ageInput.value.trim();
	const gradeText = gradeInput.value.trim().replace(",", ".");

	if (!name || !ageText || !gradeText) {
		alert("Debe completar Estudiante, Edad y Nota.");
		return null;
	}

	const ageNumber = Number(ageText);
	const gradeNumber = Number(gradeText);

	if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
		alert("La edad debe ser un numero entero mayor a 0.");
		return null;
	}

	if (!Number.isFinite(gradeNumber) || gradeNumber < 0 || gradeNumber > 10) {
		alert("La nota debe ser un numero entre 0 y 10.");
		return null;
	}

	return {
		name,
		age: String(ageNumber),
		grade: String(gradeNumber)
	};
}

function renderAll() {
	renderMasterList();
	renderEditList();
	renderDeleteList();
}

function addStudent() {
	const newStudent = readStudentFormValues(addNameInput, addAgeInput, addGradeInput);

	if (!newStudent) {
		return;
	}

	students.push(newStudent);
	clearAddInputs();
	saveStudents();
	renderAll();
}

function editStudent() {
	if (selectedEditIndex === null) {
		alert("Seleccione un estudiante para editar.");
		return;
	}

	const updatedStudent = readStudentFormValues(editNameInput, editAgeInput, editGradeInput);

	if (!updatedStudent) {
		return;
	}

	students[selectedEditIndex] = updatedStudent;
	saveStudents();
	renderAll();
}

function deleteStudents() {
	if (!students.length) {
		return;
	}

	const selectedCheckboxes = deleteStudentList.querySelectorAll("input[type='checkbox']:checked");
	const selectedIndexes = Array.from(selectedCheckboxes)
		.map((checkbox) => Number(checkbox.value))
		.sort((a, b) => b - a);

	if (!selectedIndexes.length) {
		return;
	}

	selectedIndexes.forEach((index) => {
		students.splice(index, 1);
	});

	if (selectedEditIndex !== null) {
		if (selectedIndexes.includes(selectedEditIndex)) {
			selectedEditIndex = null;
			clearEditInputs();
		} else {
			const removedBefore = selectedIndexes.filter((index) => index < selectedEditIndex).length;
			selectedEditIndex -= removedBefore;
		}
	}

	saveStudents();
	renderAll();
}

saveStudentBtn.addEventListener("click", addStudent);
saveEditBtn.addEventListener("click", editStudent);
deleteStudentsBtn.addEventListener("click", deleteStudents);

[addNameInput, addAgeInput, addGradeInput].forEach((input) => {
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			addStudent();
		}
	});
});

[editNameInput, editAgeInput, editGradeInput].forEach((input) => {
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			editStudent();
		}
	});
});

renderAll();
