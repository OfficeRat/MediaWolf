let editUserModal;

document.addEventListener("DOMContentLoaded", function () {
    editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));

    // Make editUser globally accessible
    window.editUser = function (userId) {
        const userElement = document.querySelector(`[onclick="editUser('${userId}')"]`).closest("li");
        if (!userElement) return;

        const username = userElement.childNodes[0].textContent.trim();

        // Populate modal fields
        document.getElementById("userId").value = userId;
        document.getElementById("username").value = username;
        document.getElementById("password").value = ""; // Clear password field
        document.getElementById("role").value = userElement.parentNode.previousElementSibling.textContent.includes("Admins") ? "admin" : "user";

        // Show the modal
        editUserModal.show();
    };

    document.getElementById("editUserForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const userId = document.getElementById("userId").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        // Emit update event via WebSocket
        socket.emit("save_user", { id: userId, name: username, password: password, role: role });

        // Close modal after saving
        editUserModal.hide();
    });
});

socket.on("user_updated", (data) => {
    const user = data.user;
    const userElement = document.querySelector(`[onclick="editUser('${user.id}')"]`).closest("li");

    if (userElement) {
        userElement.innerHTML = `${user.name} 
            <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">Edit</button>`;
    }
});

socket.on("user_update_failed", (data) => {
    alert("Error: " + data.error);
});
