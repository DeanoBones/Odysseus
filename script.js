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

// Frequency Mapping for "Luminara"
const frequencyMap = {
    1200: 1,    // L
    2100: 2,    // U
    1300: 3,    // M
    900: 4,     // I
    1400: 5,    // N
    100: 6,     // A
    1800: 7,    // R
};

// The correct order of frequencies for the "Luminara" word
const correctOrder = [1200, 2100, 1300, 900, 1400, 100, 1800];

// Array to store the frequencies selected by the user
let currentOrder = [];
let previousFrequency = null; // Track the previous frequency

// Function to trigger pulse and vibration on the oscilloscope (canvas)
function pulseOscilloscope() {
    // Vibration effect
    let position = 0;
    const shakeDuration = 300; // Duration of the shake in milliseconds
    const shakeDistance = 10;  // How far the canvas will shake
    const shakeInterval = 50;  // Time interval between shakes
    const shakeStartTime = Date.now();

    const shakeIntervalId = setInterval(() => {
        position = position === 0 ? shakeDistance : 0;
        canvas.style.transform = `translateX(${position}px)`;

        // Stop the shake after the shake duration
        if (Date.now() - shakeStartTime > shakeDuration) {
            clearInterval(shakeIntervalId);
            canvas.style.transform = 'translateX(0)';
        }
    }, shakeInterval);

    // Blue pulse with reduced opacity
    canvas.style.transition = "background-color 0.3s ease";
    canvas.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Blue with less opacity
    setTimeout(() => {
        canvas.style.backgroundColor = 'black'; // Reset to black after the pulse
    }, 300); // Pulse duration
}

// Function to handle flashing based on correct frequency
function handleFrequencyFlash(frequency) {
    if (frequencyMap[frequency] !== undefined && frequency !== previousFrequency) {
        const flashCount = frequencyMap[frequency];
        for (let i = 0; i < flashCount; i++) {
            setTimeout(() => {
                if (frequencyInput.value == frequency) {
                    pulseOscilloscope();
                }
            }, i * 1000); // Adjust the delay to control frequency of vibration and flash
        }
        previousFrequency = frequency;
    } else if (frequency !== previousFrequency) {
        previousFrequency = null;
    }
}

// Draw the wave (oscilloscope pattern)
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

// Event listeners for frequency input
frequencyInput.addEventListener('input', () => {
    frequency = frequencyInput.value;
    frequencyDisplay.textContent = frequency;
    drawWave(frequency);
    handleFrequencyFlash(frequency);
});

// Submit button click event for frequency input
submitButton.addEventListener('click', () => {
    const selectedFrequency = parseInt(frequencyInput.value);
    currentOrder.push(selectedFrequency);

    const listItem = document.createElement('li');
    listItem.textContent = `${selectedFrequency} Hz`;
    frequencyList.appendChild(listItem);

    if (currentOrder.length === correctOrder.length) {
        let correct = true;
        currentOrder.forEach((frequency, index) => {
            if (correctOrder[index] !== frequency) {
                correct = false;
            }
        });

        if (correct) {
            message.textContent = "Correct sequence! You won!";
            message.style.color = 'green';
            passwordSection.style.display = 'block';
        } else {
            message.textContent = "Incorrect sequence! Try again.";
            message.style.color = 'red';
            frequencyList.innerHTML = '';
        }
        currentOrder = [];
    }
});

// Password submit handler
passwordSubmit.addEventListener('click', () => {
    const enteredPassword = passwordInput.value.trim().toUpperCase();
    const correctPassword = "LUMINAR";

    if (enteredPassword === correctPassword) {
        passwordMessage.textContent = "Password correct! You unlocked the sequence!";
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

// Initial draw on load
drawWave(frequency);
