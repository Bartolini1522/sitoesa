let selectedButtonIds = [];

// Funzione per mostrare il modal
function showModal(event, buttonId) {
    if (selectedButtonIds.includes(buttonId)) {
        // Deseleziona se il LED è già selezionato
        selectedButtonIds = selectedButtonIds.filter(id => id !== buttonId);
        event.target.classList.remove('selected');
    } else {
        // Seleziona il LED
        selectedButtonIds.push(buttonId);
        event.target.classList.add('selected');
    }
    updateSelectedCount();
}

// Aggiorna il conteggio dei LED selezionati nel modal
function updateSelectedCount() {
    document.getElementById('selected-count').textContent = `Selezionati: ${selectedButtonIds.length}`;
}

// Mostra o nasconde il modal
function toggleModal() {
    const modal = document.getElementById('modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Mostra il color picker
function showColorPicker(event) {
    const colorPicker = document.getElementById('color-picker');
    colorPicker.style.display = 'block';
    colorPicker.style.top = `${event.clientY + 10}px`;
    colorPicker.style.left = `${event.clientX + 10}px`;
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
    toggleModal();
});

// Gestisce il click sul bottone "Accendi"
document.getElementById('on-button').addEventListener('click', function() {
    if (selectedButtonIds.length > 0) {
        applyBatchAction(selectedButtonIds, 'on');
    }
    toggleModal();
});

// Gestisce il click sul bottone "Spegni"
document.getElementById('off-button').addEventListener('click', function() {
    if (selectedButtonIds.length > 0) {
        applyBatchAction(selectedButtonIds, 'off');
    }
    toggleModal();
});

// Gestisce il click sui bottoni LED
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', event => showModal(event, button.id));
});

// Visualizza le coordinate del click sull'immagine
document.getElementById('photo').addEventListener('click', function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const coordinatesBox = document.getElementById('coordinates');
    coordinatesBox.textContent = `Coordinate: (${Math.round(x)}, ${Math.round(y)})`;
});
