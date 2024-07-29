let selectedButtonIds = [];
let selectedButtons = [];

// Funzione per mostrare il modal
function showModal(event, buttonId) {
    selectedButtonIds = [buttonId];
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.style.top = (event.clientY + 10) + 'px';
    modal.style.left = (event.clientX + 10) + 'px';
}

// Funzione per mostrare il color picker
function showColorPicker(event) {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = 'block';
    colorPicker.style.top = (event.clientY + 10) + 'px';
    colorPicker.style.left = (event.clientX + 10) + 'px';
}

// Gestisce il click sui bottoni LED
function handleButtonClick(event) {
    const buttonId = event.target.id;
    selectedButtonIds = [buttonId];
    selectedButtons = [event.target];
    showModal(event, buttonId);
}

// Funzione per applicare il colore a tutti i LED
function applyColorToAll(color) {
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = color;
    });
}

// Funzione per inviare richieste al server
function sendLedRequest(id, action, color = null) {
    let url;
    if (action === 'color') {
        url = `http://delfo.local:5000/set_led/${id}/${color}`;
    } else if (action === 'on') {
        url = `http://delfo.local:5000/turn_on/${id}`;
    } else if (action === 'off') {
        url = `http://delfo.local:5000/turn_off/${id}`;
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error:', error));
}

// Funzione per applicare azioni batch
function applyBatchAction(ids, action, color = null) {
    fetch('http://delfo.local:5000/batch_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: ids,
            action: action,
            color: color ? parseInt(color.slice(1), 16) : null
        })
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error:', error));
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
    if (selectedButtonIds.length === 0) {
        console.log("Nessun LED selezionato");
        return;
    }

    const colorInput = document.getElementById('color-input');
    const color = colorInput.value;
    applyBatchAction(selectedButtonIds, 'color', color);

    document.getElementById('color-picker').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
});

// Gestisce il click sul bottone "Accendi"
document.getElementById('on-button').addEventListener('click', function() {
    showColorPicker(event);
    document.getElementById('modal').style.display = 'none';
    if (selectedButtonIds.length > 0) {
        applyBatchAction(selectedButtonIds, 'on');
    }
});

// Gestisce il click sul bottone "Spegni"
document.getElementById('off-button').addEventListener('click', function() {
    if (selectedButtonIds.length > 0) {
        applyBatchAction(selectedButtonIds, 'off');
    }
    document.getElementById('modal').style.display = 'none';
});

// Aggiunge gli event listener a tutti i bottoni LED
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

// Azioni del Pannello di Controllo
document.getElementById('all-on').addEventListener('click', function() {
    applyColorToAll('white');
    console.log('Button ID: all, Color: white, Power: on');
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'white';
        sendLedRequest(button.id, 'on');
    });
});

document.getElementById('all-off').addEventListener('click', function() {
    applyColorToAll('black');
    console.log('Button ID: all, Power: off');
    document.querySelectorAll('.button').forEach(button => {
        button.style.backgroundColor = 'black';
        sendLedRequest(button.id, 'off');
    });
});

document.getElementById('apply-color').addEventListener('click', function() {
    const colorInput = document.getElementById('all-color-picker');
    const color = colorInput.value;
    applyColorToAll(color);
    console.log(`Button ID: all, color: ${color}, Power: on`);
    document.querySelectorAll('.button').forEach(button => {
        sendLedRequest(button.id, 'color', color);
    });
});
