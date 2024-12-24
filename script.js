const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');
const frequencyInput = document.getElementById('frequencyInput');
const submitButton = document.getElementById('submit-btn');
const message = document.getElementById('message');
const frequencyDisplay = document.getElementById('frequencyDisplay');
const frequencyList = document.getElementById('frequencyList');
const passwordSection = document.getElementById('passwordSection');
const passwordInput = document.getElementById('passwordInput');
const passwordMessage = document.getElementById('passwordMessage');

// Oscilloscope settings
const width = canvas.width;
const height = canvas.height;
let frequency = frequencyInput.value;

// Frequency Mapping for flash effect
const frequencyMap = {
    1200: 1,
    2100: 2,
    1300: 3,
    900: 4,
    1400: 5,
    100: 6,
};

// The correct order for the initial broadcast
const correctBroadcast = [1200, 2100, 1300, 900, 1400, 100];

// New frequencies to display upon success
const receivedFrequencies = [1900, 1700, 1400, 900, 2600, 1300];

// User-entered sequence
let currentOrder = [];
let previousFrequency = null;
let isFlashing = false;  // Flag to track if we're flashing
let currentFlashTimeouts = [];  // Array to store current flash timeouts

// Draw oscilloscope wave
function drawWave(frequency) {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;

    const amplitude = height / 4;
    const centerY = height / 2;
    const waveLength = width / frequency;
    const period = 2 * Math.PI;

    for (let x = 0; x < width; x++) {
        const angle = (x / waveLength) * period;
        const y = centerY + Math.sin(angle) * amplitude;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

// Trigger pulse and vibration effect
function pulseOscilloscope() {
    let position = 0;
    const shakeDuration = 300;
    const shakeDistance = 10;
    const shakeInterval = 50;
    const shakeStartTime = Date.now();

    const shakeIntervalId = setInterval(() => {
        position = position === 0 ? shakeDistance : 0;
        canvas.style.transform = `translateX(${position}px)`;

        if (Date.now() - shakeStartTime > shakeDuration) {
            clearInterval(shakeIntervalId);
            canvas.style.transform = 'translateX(0)';
        }
    }, shakeInterval);

    canvas.style.transition = "background-color 0.3s ease";
    canvas.style.backgroundColor = 'rgba(0, 0, 255, 0.05)';
    setTimeout(() => {
        canvas.style.backgroundColor = 'black';
    }, 300);
}

// Handle frequency flash effect
function handleFrequencyFlash(frequency) {
    if (isFlashing) {
        currentFlashTimeouts.forEach(timeout => clearTimeout(timeout));  // Clear existing timeouts
        currentFlashTimeouts = [];
        isFlashing = false;
    }

    // Only flash if it's a valid frequency
    if (frequencyMap[frequency] !== undefined) {
        isFlashing = true;  // Mark as flashing
        const flashCount = frequencyMap[frequency];

        // Set up the flash sequence
        for (let i = 0; i < flashCount; i++) {
            const timeoutId = setTimeout(() => {
                if (frequencyInput.value == frequency) {
                    pulseOscilloscope();
                }
            }, i * 1000);
            currentFlashTimeouts.push(timeoutId);  // Store the timeout
        }

        
    }
}

// Add received frequencies one at a time with a delay
function addReceivedFrequencies() {
    // Hide the oscilloscope, submit button, and frequency display
    canvas.style.display = 'none';
    submitButton.style.display = 'none';
    frequencyInput.style.display = 'none';
    frequencyDisplay.textContent = ''; // Clear frequency text

    // Also hide the "Oscilloscope Frequency" and "Frequency: Hz" text
    const oscilloscopeTitle = document.querySelector('h2');
    const frequencyLabel = document.querySelector('p');

    oscilloscopeTitle.style.display = 'none';  // Hide the "Oscilloscope Frequency" text
    frequencyLabel.style.display = 'none';    // Hide the "Frequency: Hz" text

    let index = 0;

    function addNextFrequency() {
        if (index < receivedFrequencies.length) {
            const newItem = document.createElement('li');
            newItem.textContent = `${receivedFrequencies[index]} Hz`;
            frequencyList.appendChild(newItem);
            index++;
            setTimeout(addNextFrequency, 5000); // 5-second delay
        } else {
            // All frequencies added, show password section
            passwordSection.style.display = 'block'; // Show password section after adding all
        }
    }

    addNextFrequency();
}

// Frequency input listener
frequencyInput.addEventListener('input', () => {
    frequency = frequencyInput.value;
    frequencyDisplay.textContent = `${frequency} Hz`; // Update frequency text
    drawWave(frequency);
    handleFrequencyFlash(frequency);
});

// Submit button for broadcasting
submitButton.addEventListener('click', () => {
    const selectedFrequency = parseInt(frequencyInput.value);
    currentOrder.push(selectedFrequency);

    const listItem = document.createElement('li');
    listItem.textContent = `${selectedFrequency} Hz`;
    frequencyList.appendChild(listItem);

    if (currentOrder.length === correctBroadcast.length) {
        let isCorrect = true;
        for (let i = 0; i < correctBroadcast.length; i++) {
            if (currentOrder[i] !== correctBroadcast[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            message.textContent = "Connection estAblishEd Successfully incoming trAnsmission Received +!";
            message.style.color = 'green';

            // Clear the list and start adding received frequencies
            frequencyList.innerHTML = "";
            addReceivedFrequencies();
        } else {
            message.textContent = "No response! Try again.";
            message.style.color = 'red';
            frequencyList.innerHTML = ""; // Reset the list
        }

        currentOrder = [];
    }
});

// Password input listener for Enter key
passwordInput.addEventListener('keypress', (event) => {
    // Check if Enter (key code 13) is pressed
    if (event.key === 'Enter') {
        const enteredPassword = passwordInput.value.trim().toUpperCase();
        const correctPassword = "TROJAN";

        if (enteredPassword === correctPassword) {
            passwordMessage.textContent = "Access Granted!";
            passwordMessage.style.color = 'green';

            const riddleText = document.createElement('p');
            riddleText.textContent = "You may think I'm a reindeer, but I’m not quite the same, with eyes so bright, they put Rudolph to shame. A gentle pull on my tail, and power will flow, revealing the path that you’re meant to know.";
            riddleText.style.marginTop = '20px';
            riddleText.style.color = 'green';
            passwordSection.appendChild(riddleText);

            const continueButton = document.createElement('button');
            continueButton.textContent = "open.exe";
            continueButton.style.marginTop = '10px';
            continueButton.style.padding = '10px 20px';
            continueButton.style.fontSize = '1rem';
            continueButton.style.cursor = 'pointer';
            continueButton.style.borderRadius = '5px';
            continueButton.style.backgroundColor = 'lime';
            continueButton.style.color = 'black';

            continueButton.addEventListener('click', () => {
                window.location.href = "https://deanobones.github.io/Odysseustrix/"; // Redirect after password success
            });

            passwordSection.appendChild(continueButton);
        } else {
            passwordMessage.textContent = "Incorrect Translation. Try again!";
            passwordMessage.style.color = 'red';
        }
    }
});

// Initial oscilloscope draw
drawWave(frequency);
