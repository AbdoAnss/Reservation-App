document.addEventListener('DOMContentLoaded', function () {
    // Get references to the sidebar and the toggle button
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebar');

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', function () {
        // Toggle the 'active' class on the sidebar
        sidebar.classList.toggle('active');
    });
});
