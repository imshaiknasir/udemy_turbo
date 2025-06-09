const slider = document.getElementById('speed-slider');
const label = document.getElementById('speed-label');
const resetBtn = document.getElementById('reset-btn');

// Function to update speed
const updateSpeed = (newSpeed) => {
    // 1. Update the UI
    slider.value = newSpeed;
    label.textContent = `${newSpeed}x`;
    
    // 2. Save the new speed to storage
    browser.storage.local.set({ speed: newSpeed });
    
    // 3. Send a message to the active tab's content script
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0] && tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, { newSpeed: newSpeed });
        }
    });
};

// Load the saved speed and update the UI when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local.get('speed').then((result) => {
        const currentSpeed = result.speed || 1;
        slider.value = currentSpeed;
        label.textContent = `${currentSpeed}x`;
    });
});

// Listen for changes on the slider
slider.addEventListener('input', (event) => {
    const newSpeed = event.target.value;
    updateSpeed(newSpeed);
});

// Listen for reset button clicks
resetBtn.addEventListener('click', () => {
    updateSpeed(1);
});