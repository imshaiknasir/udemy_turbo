// Function to find the video element and set its speed
const setSpeed = (rate) => {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = parseFloat(rate);
        console.log(`Udemy Speed Controller: Set speed to ${rate}x`);
    }
};

// Function to apply saved speed
const applySavedSpeed = () => {
    browser.storage.local.get('speed').then((result) => {
        const savedSpeed = result.speed || 1;
        setSpeed(savedSpeed);
    });
};

// 1. Listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.newSpeed) {
        setSpeed(request.newSpeed);
    }
});

// 2. Set the initial speed when the page loads
applySavedSpeed();

// 3. Monitor for URL changes (SPA navigation)
let currentUrl = window.location.href;
const checkForUrlChange = () => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('Udemy Speed Controller: URL changed, reapplying speed');
        // Wait a bit for the new video to load
        setTimeout(applySavedSpeed, 1000);
        setTimeout(applySavedSpeed, 3000); // Backup check
    }
};

// Check for URL changes every second
setInterval(checkForUrlChange, 1000);

// 4. Use a MutationObserver to detect video element changes
const observer = new MutationObserver((mutations) => {
    let shouldApplySpeed = false;
    
    for (const mutation of mutations) {
        // Check for added video elements
        if (mutation.addedNodes.length > 0) {
            const hasVideo = Array.from(mutation.addedNodes).some(node => 
                node.tagName === 'VIDEO' || 
                (node.querySelector && node.querySelector('video'))
            );
            if (hasVideo) {
                shouldApplySpeed = true;
                break;
            }
        }
        
        // Check for attribute changes on video elements
        if (mutation.type === 'attributes' && mutation.target.tagName === 'VIDEO') {
            if (mutation.attributeName === 'src' || mutation.attributeName === 'currentSrc') {
                shouldApplySpeed = true;
                break;
            }
        }
    }
    
    if (shouldApplySpeed) {
        console.log('Udemy Speed Controller: Video element detected, applying speed');
        setTimeout(applySavedSpeed, 500);
    }
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'currentSrc']
});

// 5. Listen for video events to ensure speed persistence
const attachVideoListeners = () => {
    const video = document.querySelector('video');
    if (video && !video.hasAttribute('data-speed-controller-attached')) {
        video.setAttribute('data-speed-controller-attached', 'true');
        
        // Apply speed when video loads
        video.addEventListener('loadstart', () => {
            console.log('Udemy Speed Controller: Video loadstart event');
            setTimeout(applySavedSpeed, 100);
        });
        
        video.addEventListener('loadedmetadata', () => {
            console.log('Udemy Speed Controller: Video loadedmetadata event');
            applySavedSpeed();
        });
        
        video.addEventListener('canplay', () => {
            console.log('Udemy Speed Controller: Video canplay event');
            applySavedSpeed();
        });
        
        // Detect if speed gets reset externally
        video.addEventListener('ratechange', (e) => {
            browser.storage.local.get('speed').then((result) => {
                const savedSpeed = parseFloat(result.speed || 1);
                const currentSpeed = parseFloat(video.playbackRate);
                
                // If the speed doesn't match our saved speed, reapply it
                if (Math.abs(currentSpeed - savedSpeed) > 0.01) {
                    console.log(`Udemy Speed Controller: Speed mismatch detected (${currentSpeed} vs ${savedSpeed}), reapplying`);
                    setTimeout(() => setSpeed(savedSpeed), 100);
                }
            });
        });
    }
};

// 6. Periodic checks to ensure speed persistence
const periodicCheck = () => {
    attachVideoListeners();
    
    const video = document.querySelector('video');
    if (video) {
        browser.storage.local.get('speed').then((result) => {
            const savedSpeed = parseFloat(result.speed || 1);
            const currentSpeed = parseFloat(video.playbackRate);
            
            // If speeds don't match, reapply the saved speed
            if (Math.abs(currentSpeed - savedSpeed) > 0.01) {
                console.log(`Udemy Speed Controller: Periodic check - reapplying speed (${currentSpeed} -> ${savedSpeed})`);
                setSpeed(savedSpeed);
            }
        });
    }
};

// Run periodic checks every 5 seconds
setInterval(periodicCheck, 5000);

// Initial attachment of video listeners
setTimeout(attachVideoListeners, 1000);