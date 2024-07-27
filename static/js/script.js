// script.js

let selectedButtonId;
let selectedButton;
let multiSelectMode = false; // Modalità selezione multipla

// Mostra il modal quando un bottone LED è cliccato
function showModal(event, buttonId) {
    if (multiSelectMode) return; // Ignora il click se è attiva la modalità selezione multipla
    selectedButtonId = buttonId;
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.style.top = (event.clientY + 10) + 'px';
    modal.style.left = (event.clientX + 10) + 'px';
}

// Mostra il color picker per scegliere il colore
function showColorPicker(event) {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = 'block';
    colorPicker.style.top = (event.clientY + 10) + 'px';
    colorPicker.style.left = (event.clientX + 10) + 'px';
}

// Gestisce il click sui bottoni LED
function handleButtonClick(event) {
    const buttonId = event.target.id;
    selectedButton = event.target;
    showModal(event, buttonId);
}

// Applica il colore selezionato al LED
function applyColorToButton(button, color) {
    button.style.backgroundColor = color;
}

// Funzione per inviare la richiesta al server
function sendLedRequest(buttonId, state, color) {
    // Qui va la logica per inviare la richiesta
    console.log(`Button ID: ${buttonId}, State: ${state}, Color: ${color}`);
}

// Aggiungi gli eventi di click ai bottoni LED
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Accendi il LED selezionato
document.getElementById('on-button').addEventListener('click', function() {
    selectedButton.style.backgroundColor = 'yellow';
    sendLedRequest(selectedButtonId, 'on', 'yellow');
    document.getElementById('modal').style.display = 'none';
});

// Spegni il LED selezionato
document.getElementById('off-button').addEventListener('click', function() {
    selectedButton.style.backgroundColor = 'black';
    sendLedRequest(selectedButtonId, 'off', 'black');
    document.getElementById('modal').style.display = 'none';
});

// Mostra il color picker per singolo LED
document.getElementById('submit-color').addEventListener('click', function() {
    const color = document.getElementById('color-input').value;
    applyColorToButton(selectedButton, color);
    sendLedRequest(selectedButtonId, 'on', color);
    document.getElementById('color-picker').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
});

// Accendi tutti i LED
document.getElementById('all-on').addEventListener('click', function() {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'yellow';
        const buttonId = button.id;
        sendLedRequest(buttonId, 'on', 'yellow');
    });
});

// Spegni tutti i LED
document.getElementById('all-off').addEventListener('click', function() {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'black';
        const buttonId = button.id;
        sendLedRequest(buttonId, 'off', 'black');
    });
});

// Applica un colore a tutti i LED
document.getElementById('apply-color').addEventListener('click', function() {
    const color = document.getElementById('all-color-picker').value;
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = color;
        const buttonId = button.id;
        sendLedRequest(buttonId, 'on', color);
    });
});

// Selezione multipla
document.getElementById('multi-select-toggle').addEventListener('click', function() {
    multiSelectMode = !multiSelectMode;
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.style.display = multiSelectMode ? 'block' : 'none';
    });

    // Mostra il color picker per la selezione multipla
    document.getElementById('multi-color-picker').style.display = multiSelectMode ? 'block' : 'none';
});

// Applica il colore ai LED selezionati
document.getElementById('apply-multi-color').addEventListener('click', function() {
    const color = document.getElementById('multi-color-input').value;
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
        const buttonId = checkbox.id.split('-')[1];
        const button = document.getElementById(`button-${buttonId}`);
        applyColorToButton(button, color);
        sendLedRequest(buttonId, 'on', color);
    });

    // Disattiva la modalità di selezione multipla
    multiSelectMode = false;
    document.getElementById('multi-color-picker').style.display = 'none';
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.style.display = 'none';
        checkbox.checked = false;
    });
});

// Spegni solo i LED selezionati
document.getElementById('turn-off-selected').addEventListener('click', function() {
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
        const buttonId = checkbox.id.split('-')[1];
        const button = document.getElementById(`button-${buttonId}`);
        button.style.backgroundColor = 'black';
        sendLedRequest(buttonId, 'off', 'black');
    });

    // Disattiva la modalità di selezione multipla
    multiSelectMode = false;
    document.getElementById('multi-color-picker').style.display = 'none';
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.style.display = 'none';
        checkbox.checked = false;
    });
});
