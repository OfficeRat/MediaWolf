let editUserModal, newUserModal;

document.addEventListener("DOMContentLoaded", function () {
    editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    newUserModal = new bootstrap.Modal(document.getElementById('newUserModal'));

    window.editUser = function (userId) {
        openEditModal(userId);
    };

    function openEditModal(userId) {
        const userElement = document.querySelector(`[data-user-id="${userId}"]`);
        if (!userElement) return;

        const username = userElement.querySelector(".user-name").textContent.trim();

        document.getElementById("userId").value = userId;
        document.getElementById("username").value = username;
        document.getElementById("password").value = "";
        document.getElementById("role").value = userElement.dataset.role;

        editUserModal.show();
    }

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            const userId = event.target.closest("li").dataset.userId;
            editUser(userId);
        } else if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.closest("li").dataset.userId;
            deleteUser(userId);
        }
    });

    document.getElementById("editUserForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const userId = document.getElementById("userId").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        socket.emit("save_user", { id: userId, name: username, password, role });
        editUserModal.hide();
    });

    document.getElementById("newUserForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;
        const role = document.getElementById("newRole").value;

        console.log(name);
        socket.emit("create_user", { name, password, role });
        newUserModal.hide();
    });

    window.deleteUser = function (userId) {
        if (confirm("Are you sure?")) {
            socket.emit("delete_user", { id: userId });
        }
    };

    socket.on("user_deleted", (data) => {
        document.querySelector(`[data-user-id="${data.id}"]`)?.remove();
    });

    socket.on("user_created", (data) => location.reload());
    socket.on("user_updated", (data) => location.reload());
});
