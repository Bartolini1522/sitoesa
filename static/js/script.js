let selectedButtonId;
let selectedButton;

// Mostra il modal quando un bottone LED è cliccato
function showModal(event, buttonId) {
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

// Applica il colore selezionato a tutti i bottoni LED
function applyColorToAll(color) {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = color;
    });
}

// Invia la richiesta al server Flask per controllare i LED
function sendLedRequest(id, color = null) {
    const url = color !== null ? `http://delfo.local:5000/set_led/${id}/${color}` : `http://delfo.local:5000/turn_off/${id}`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Invia un corpo vuoto se non hai dati specifici da inviare
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update LED');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
 

// Visualizza le coordinate del click sull'immagine
document.getElementById('photo').addEventListener('click', function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const coordinatesBox = document.getElementById('coordinates');
    coordinatesBox.textContent = `Coordinate: (${Math.round(x)}, ${Math.round(y)})`;
});

// Gestisce l'applicazione del colore scelto tramite color picker
document.getElementById('submit-color').addEventListener('click', function() {
    if (!selectedButtonId) {
        console.log("No button selected");
        return;
    }

    const colorInput = document.getElementById('color-input');
    const color = colorInput.value;
    const selectedButton = document.getElementById(selectedButtonId);

    if (selectedButton) {
        selectedButton.style.backgroundColor = color;
        console.log(`Button ID: ${selectedButtonId}, Color: ${color}, Power: On`);

        // Converti il colore in RGB
        const rgb = parseInt(color.slice(1), 16);
        sendLedRequest(selectedButtonId, rgb);
    }

    document.getElementById('color-picker').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
});

// Gestisce il click sul bottone "Accendi"
document.getElementById('on-button').addEventListener('click', function() {
    showColorPicker(event);
    document.getElementById('modal').style.display = 'none';
});

// Gestisce il click sul bottone "Spegni"
document.getElementById('off-button').addEventListener('click', function() {
    if (selectedButton) {
        selectedButton.style.backgroundColor = 'black';
        console.log(`Button ID: ${selectedButtonId}, Power: Off`);
        sendLedRequest(selectedButtonId);
    }
    document.getElementById('modal').style.display = 'none';
});

// Aggiunge gli event listener a tutti i bottoni LED
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Azioni del Pannello di Controllo
document.getElementById('all-on').addEventListener('click', function() {
    applyColorToAll('white'); // Accendi tutti i LED con colore bianco
    console.log('Button ID: all, Color: white, Power: on');

    // Accendi tutti i LED con colore bianco
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'white';
        sendLedRequest(button.id, 0xFFFFFF);
    });
});

document.getElementById('all-off').addEventListener('click', function() {
    applyColorToAll('black'); // Spegni tutti i LED (colore nero)
    console.log('Button ID: all, Power: off');

    // Spegni tutti i LED
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'black';
        sendLedRequest(button.id);
    });
});

document.getElementById('apply-color').addEventListener('click', function() {
    const colorInput = document.getElementById('all-color-picker');
    const color = colorInput.value;
    applyColorToAll(color);
    console.log(`Button ID: all, color: ${color}, Power: on`);

    // Converti il colore in RGB
    const rgb = parseInt(color.slice(1), 16);
    document.querySelectorAll('.button').forEach(button => {
        sendLedRequest(button.id, rgb);
    });
});

