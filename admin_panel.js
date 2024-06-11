document.addEventListener("DOMContentLoaded", function () {
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const removePlayerBtn = document.getElementById('removePlayerBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const addStatsBtn = document.getElementById('addStatsBtn');
    const removePlayerSelect = document.getElementById('removePlayer');
    const playerNameSelect = document.getElementById('playerName');
    const message = document.getElementById('message');

const webAppUrl = 'https://script.google.com/macros/s/AKfycbwEULGWu59qZK4oXaA-D9s_BWJOHz4ZPZx35sg4VOK8qekzs4ffLerESdCLm96jh-Y/exec';

function fetchPlayers() {
    fetch(webAppUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'getAll' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            updatePlayerDropdowns(data.players);
        } else {
            message.textContent = 'Failed to fetch players.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        message.textContent = 'Error fetching players.';
    });
}
    function updatePlayerDropdowns(players) {
        removePlayerSelect.innerHTML = "";
        playerNameSelect.innerHTML = "<option value=''>Select Player</option>";
        players.forEach(player => {
            let option = document.createElement('option');
            option.value = player;
            option.text = player;
            removePlayerSelect.add(option);
            playerNameSelect.add(option.cloneNode(true));
        });
    }

    fetchPlayers();

addPlayerBtn.addEventListener('click', function () {
    const newPlayerInput = document.getElementById('newPlayer');
    const newPlayer = newPlayerInput.value.trim();
    if (newPlayer) {
        fetch(webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'add', playerName: newPlayer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                fetchPlayers();
                newPlayerInput.value = '';
                message.textContent = 'Player added successfully.';
            } else {
                message.textContent = `Failed to add player: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            message.textContent = 'Error adding player.';
        });
    } else {
        message.textContent = 'Player name cannot be empty.';
    }
});

    removePlayerBtn.addEventListener('click', function () {
        const removePlayer = removePlayerSelect.value;
        if (removePlayer) {
            fetch(webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({action: 'remove', playerName: removePlayer})
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    fetchPlayers();
                    message.textContent = "Player removed successfully.";
                } else {
                    message.textContent = "Failed to remove player: " + data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = "Error removing player.";
            });
        } else {
            message.textContent = "No player selected.";
        }
    });

    sendMessageBtn.addEventListener('click', function () {
        const messageTitle = document.getElementById('messageTitle').value;
        const messageDescription = document.getElementById('messageDescription').value;
        const messageColor = document.getElementById('messageColor').value;

        if (messageTitle && messageDescription) {
            const payload = {
                embeds: [{
                    title: messageTitle,
                    description: messageDescription,
                    color: parseInt(messageColor.slice(1), 16)
                }]
            };

            // Replace 'YOUR_DISCORD_WEBHOOK_URL' with your actual Discord webhook URL
            const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    message.textContent = "Message sent to Discord.";
                } else {
                    message.textContent = "Failed to send message.";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = "Error sending message.";
            });
        } else {
            message.textContent = "Title or description cannot be empty.";
        }
    });

    addStatsBtn.addEventListener('click', function () {
        const playerName = playerNameSelect.value;
        if (playerName) {
            message.textContent = "Player stats added.";
        } else {
            message.textContent = "No player selected.";
        }
    });
});
