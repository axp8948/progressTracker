function selectClass(classId) {
    localStorage.setItem("selectedClass", classId);
    window.location.href = "classes.html"; // Redirect to details page
}

