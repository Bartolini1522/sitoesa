// script.js

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.button');
    const toggleMultiSelectBtn = document.getElementById('toggle-multi-select');
    const modal = document.getElementById('modal');
    const coordinates = document.getElementById('coordinates');
    const colorPicker = document.getElementById('color-picker');
    const allOnBtn = document.getElementById('all-on');
    const allOffBtn = document.getElementById('all-off');
    const applyColorBtn = document.getElementById('apply-color');
    const allColorPicker = document.getElementById('all-color-picker');
    const submitColorBtn = document.getElementById('submit-color');
    const onButton = document.getElementById('on-button');
    const offButton = document.getElementById('off-button');
    const modalApplyColorBtn = document.getElementById('modal-apply-color');
    const modalColorPicker = document.getElementById('modal-color-picker');

    let multiSelectMode = false;
    let selectedButtons = new Set();

    console.log("JavaScript initialized and DOM content loaded");

    // Toggle multi-select mode
    toggleMultiSelectBtn.addEventListener('click', function () {
        multiSelectMode = !multiSelectMode;
        toggleMultiSelectBtn.classList.toggle('active', multiSelectMode);

        console.log(`Multi-select mode: ${multiSelectMode ? 'ON' : 'OFF'}`);

        if (!multiSelectMode) {
            // Clear selected buttons if exiting multi-select mode
            console.log("Clearing selected buttons on exit of multi-select mode");
            selectedButtons.forEach(button => button.classList.remove('selected'));
            selectedButtons.clear();
        }
    });

    // Toggle LED selection in multi-select mode
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (multiSelectMode) {
                e.preventDefault(); // Prevent default behavior
                toggleLEDSelection(button);
            } else {
                showLEDOptions(button);
            }
        });
    });

    // Function to toggle LED selection
    function toggleLEDSelection(button) {
        if (selectedButtons.has(button)) {
            button.classList.remove('selected');
            selectedButtons.delete(button);
            console.log(`Deselected LED: ${button.id}`);
        } else {
            button.classList.add('selected');
            selectedButtons.add(button);
            console.log(`Selected LED: ${button.id}`);
        }
    }

    // Function to show LED options in single mode
    function showLEDOptions(button) {
        // Open the modal for individual LED control
        modal.style.display = 'block';
        console.log(`Opening modal for LED: ${button.id}`);

        // Set the modal to control this specific LED
        onButton.onclick = () => {
            console.log(`Request to turn ON LED: ${button.id}`);
            sendToggleRequest(button, true);
        };
        offButton.onclick = () => {
            console.log(`Request to turn OFF LED: ${button.id}`);
            sendToggleRequest(button, false);
        };
        modalApplyColorBtn.onclick = () => {
            const color = modalColorPicker.value;
            console.log(`Request to change color of LED: ${button.id} to ${color}`);
            sendChangeColorRequest(button, color);
        };
    }

    // Function to send toggle request
    function sendToggleRequest(button, state) {
        fetch('http://delfo.local:5000/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: button.id, state: state })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toggleLED(button, state);
                console.log(`Server responded: LED ${button.id} is now ${state ? 'ON' : 'OFF'}`);
            } else {
                console.error(`Failed to toggle LED: ${button.id}`);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to toggle LED state
    function toggleLED(button, state) {
        button.style.backgroundColor = state ? 'red' : 'black';
        button.classList.remove('selected'); // Remove selection on toggle
        console.log(`LED ${button.id} visually updated to ${state ? 'ON' : 'OFF'}`);
    }

    // Function to send color change request
    function sendChangeColorRequest(button, color) {
        fetch('http://delfo.local:5000/change_color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: button.id, color: color })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                changeLEDColor(button, color);
                console.log(`Server responded: Color of LED ${button.id} changed to ${color}`);
            } else {
                console.error(`Failed to change color of LED: ${button.id}`);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to change LED color
    function changeLEDColor(button, color) {
        button.style.backgroundColor = color;
        button.classList.remove('selected'); // Remove selection on color change
        console.log(`LED ${button.id} color visually updated to ${color}`);
    }

    // Close modal on outside click
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            console.log("Modal closed");
        }
    }

    // Batch actions for selected LEDs
    function applyActionToSelectedLEDs(action, color) {
        const selectedIds = Array.from(selectedButtons).map(button => button.id);

        console.log(`Applying batch action: ${action} to LEDs: ${selectedIds.join(', ')}${action === 'color' ? ` with color ${color}` : ''}`);

        fetch('http://delfo.local:5000/batch_action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds, action: action, color: color })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                selectedButtons.forEach(button => {
                    switch (action) {
                        case 'on':
                            toggleLED(button, true);
                            break;
                        case 'off':
                            toggleLED(button, false);
                            break;
                        case 'color':
                            changeLEDColor(button, color);
                            break;
                        default:
                            break;
                    }
                });
                console.log(`Server responded: Batch action ${action} applied successfully`);
            } else {
                console.error(`Failed to apply batch action: ${action}`);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Apply color to all selected LEDs
    applyColorBtn.addEventListener('click', function () {
        const color = allColorPicker.value;
        console.log(`Apply color ${color} to selected LEDs`);
        applyActionToSelectedLEDs('color', color);
    });

    // Turn on all selected LEDs
    allOnBtn.addEventListener('click', function () {
        console.log("Turning ON all selected LEDs");
        applyActionToSelectedLEDs('on');
    });

    // Turn off all selected LEDs
    allOffBtn.addEventListener('click', function () {
        console.log("Turning OFF all selected LEDs");
        applyActionToSelectedLEDs('off');
    });

    // Individual LED control using modal
    submitColorBtn.addEventListener('click', function () {
        const color = colorPicker.querySelector('#color-input').value;
        const button = document.querySelector('.button.selected');
        if (button) {
            console.log(`Submit color ${color} for LED: ${button.id}`);
            sendChangeColorRequest(button, color);
            colorPicker.style.display = 'none';
        }
    });

    // Update coordinates on mouse movement
    document.addEventListener('mousemove', function (e) {
        const x = e.clientX;
        const y = e.clientY;
        coordinates.innerText = `Coordinate: (${x}, ${y})`;
        console.log(`Mouse coordinates updated: (${x}, ${y})`);
    });
});
