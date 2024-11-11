window.onload = function() {
    // Check if user data exists in localStorage
    const userName = localStorage.getItem('userName');
    const userProfileImage = localStorage.getItem('userProfileImage'); // Example: URL of the image

    // Set a personalized greeting
    if (userName) {
        document.querySelector('#greeting').innerHTML = `Welcome back, ${userName}!`;
    }

    // Set the profile image
    const userImageElement = document.getElementById('userImage');
    if (userProfileImage) {
        // Use custom image if available
        userImageElement.src = userProfileImage;
    } else {
        // Use default image from the 'images' folder
        userImageElement.src = 'images/default-avatar.png';  // Ensure the default image exists in the 'images' folder
    }
};
