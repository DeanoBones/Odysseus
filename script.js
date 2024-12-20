const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');
const frequencyInput = document.getElementById('frequencyInput');
const submitButton = document.getElementById('submit-btn');
const message = document.getElementById('message');
const frequencyDisplay = document.getElementById('frequencyDisplay');
const frequencyList = document.getElementById('frequencyList');
const passwordSection = document.getElementById('passwordSection');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmit = document.getElementById('passwordSubmit');
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
const receivedFrequencies = [2000, 1800, 1500, 1000, 100, 1400];

// User-entered sequence
let currentOrder = [];
let previousFrequency = null;

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
    canvas.style.backgroundColor = 'rgba(0, 0, 255, 0.01)';
    setTimeout(() => {
        canvas.style.backgroundColor = 'black';
    }, 300);
}

// Handle frequency flash effect
function handleFrequencyFlash(frequency) {
    if (frequencyMap[frequency] !== undefined && frequency !== previousFrequency) {
        const flashCount = frequencyMap[frequency];
        for (let i = 0; i < flashCount; i++) {
            setTimeout(() => {
                if (frequencyInput.value == frequency) {
                    pulseOscilloscope();
                }
            }, i * 1000);
        }
        previousFrequency = frequency;
    } else if (frequency !== previousFrequency) {
        previousFrequency = null;
    }
}

// Add received frequencies one at a time with a delay
function addReceivedFrequencies() {
    // Hide the oscilloscope, submit button, and frequency display
    canvas.style.display = 'none';
    submitButton.style.display = 'none';
    frequencyInput.style.display = 'none';
    frequencyDisplay.textContent = ''; // Clear frequency text

    let index = 0;

    function addNextFrequency() {
        if (index < receivedFrequencies.length) {
            const newItem = document.createElement('li');
            newItem.textContent = `${receivedFrequencies[index]} Hz`;
            frequencyList.appendChild(newItem);
            index++;
            setTimeout(addNextFrequency, 2000); // 2-second delay
        } else {
            // All frequencies added
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
            message.textContent = "Broadcasting success! Transmition is being received!";
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

// Password submit
passwordSubmit.addEventListener('click', () => {
    const enteredPassword = passwordInput.value.trim().toUpperCase();
    const correctPassword = "TROJAN";

    if (enteredPassword === correctPassword) {
        passwordMessage.textContent = "Password correct!";
        passwordMessage.style.color = 'green';

        const riddleText = document.createElement('p');
        riddleText.textContent = "I stand still, yet I move. I carry secrets inside. Find me where I neigh in silence.";
        riddleText.style.marginTop = '20px';
        riddleText.style.color = 'white';
        passwordSection.appendChild(riddleText);

        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.style.marginTop = '10px';
        continueButton.style.padding = '10px 20px';
        continueButton.style.fontSize = '1rem';
        continueButton.style.cursor = 'pointer';
        continueButton.style.borderRadius = '5px';
        continueButton.style.backgroundColor = 'lime';
        continueButton.style.color = 'black';

        continueButton.addEventListener('click', () => {
            window.location.href = "https://deanobones.github.io/Odysseustrix/";
        });

        passwordSection.appendChild(continueButton);
    } else {
        passwordMessage.textContent = "Incorrect password. Try again!";
        passwordMessage.style.color = 'red';
    }
});

// Initial oscilloscope draw
drawWave(frequency);
