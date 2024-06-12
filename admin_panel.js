document.addEventListener('DOMContentLoaded', function() {
    // Selecting elements
    const addPlayerForm = document.getElementById('add-player-form');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const newPlayerInput = document.getElementById('newPlayer');
    const positionInput = document.getElementById('position');
    const discordUsernameInput = document.getElementById('discordUsername');
    const removePlayerForm = document.getElementById('remove-player-form');
    const removePlayerBtn = document.getElementById('removePlayerBtn');
    const removePlayerSelect = document.getElementById('removePlayer');
    const messageElement = document.getElementById('message');
    const clubPlayersList = document.getElementById('club-players-list');
    const createFormationForm = document.getElementById('create-formation-form');
    const formationSelect = document.getElementById('formationSelect');
    const discordWebhookUrlInput = document.getElementById('discordWebhookUrl');
    const messageContentInput = document.getElementById('messageContent');
    const messageImageInput = document.getElementById('messageImage');
    const sendDiscordMessageBtn = document.getElementById('sendDiscordMessageBtn');
    const playerStatsForm = document.getElementById('player-stats-form');
    const addPlayerStatsBtn = document.getElementById('addPlayerStatsBtn');
    const playerNameSelect = document.getElementById('playerName');
    const gpInput = document.getElementById('gp');
    const goalsInput = document.getElementById('goals');
    const assistsInput = document.getElementById('assists');
    const shotsInput = document.getElementById('shots');
    const passesInput = document.getElementById('passes');
    const passAttemptsInput = document.getElementById('passAttempts');
    const savesInput = document.getElementById('saves');
    const concededInput = document.getElementById('conceded');
    const dribblesInput = document.getElementById('dribbles');
    const tacklesInput = document.getElementById('tackles');
    const offsidesInput = document.getElementById('offsides');
    const foulsInput = document.getElementById('fouls');
    const pwInput = document.getElementById('pw');
    const plInput = document.getElementById('pl');
    const rcInput = document.getElementById('rc');
    const motmInput = document.getElementById('motm');


    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAeU712F7ODiBqXiVCk3FHiQbFCEULCv2E",
        authDomain: "harchester-united-4c144.firebaseapp.com",
        databaseURL: "https://harchester-united-4c144-default-rtdb.firebaseio.com",
        projectId: "harchester-united-4c144",
        storageBucket: "harchester-united-4c144.appspot.com",
        messagingSenderId: "530403141350",
        appId: "1:530403141350:web:2ae9d51143f82ac96bfd27"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    const database = firebase.database();

    // Select all panel links
    const panelLinks = document.querySelectorAll('.panel-link');

    // Select all sections
    const sections = document.querySelectorAll('.panel');

    // Hide all sections initially
    sections.forEach(section => {
        section.style.display = 'none';
    });


    // Initialize players and populate playerNameSelect and clubPlayersList
    function initializePlayers() {
        const playersRef = database.ref('players');
        return new Promise((resolve, reject) => {
            playersRef.once('value', snapshot => {
                playerNameSelect.innerHTML = ''; // Clear existing options
                removePlayerSelect.innerHTML = ''; // Clear existing options
                clubPlayersList.innerHTML = ''; // Clear existing club players list
                snapshot.forEach(childSnapshot => {
                    const player = childSnapshot.val();

                    // Add player to player stats form select
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.textContent = player.name;
                    playerNameSelect.appendChild(option);

                    // Add player to remove player form select
                    const removeOption = document.createElement('option');
                    removeOption.value = childSnapshot.key;
                    removeOption.textContent = player.name;
                    removePlayerSelect.appendChild(removeOption);

                    // Add player to club players list
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-player-id', childSnapshot.key); // Set data attribute with player ID
                    listItem.textContent = `${player.name} - ${player.position || 'N/A'} - Discord: ${player.discordUsername || 'N/A'}`;
                    clubPlayersList.appendChild(listItem);
                });
                resolve(); // Resolve the promise once players are loaded
            }, error => {
                reject(error); // Reject with error if there's an issue
            });
        });
    }

    // Populate positions for selected formation
    function populatePositions(formation) {
        const positionsDiv = document.getElementById('positions');
        positionsDiv.innerHTML = '';

        let positions;
        if (formation === '433') {
            positions = ['GK', 'LB', 'CB', 'CB', 'RB', 'DM', 'CM', 'CM', 'RW', 'ST', 'LW'];
        } else if (formation === '352') {
            positions = ['GK', 'LCB', 'CB', 'RCB', 'LB', 'LM', 'CM1', 'CM2', 'RM', 'ST1', 'ST2'];
        }

        positions.forEach(position => {
            const label = document.createElement('label');
            label.textContent = position + ':';

            const select = document.createElement('select');
            select.id = position;
            select.name = position;
            select.required = true;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Player';
            select.appendChild(defaultOption);

            const playersRef = database.ref('players');
            playersRef.once('value', snapshot => {
                snapshot.forEach(childSnapshot => {
                    const player = childSnapshot.val();
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.textContent = player.name;
                    select.appendChild(option);
                });
            });

            const br = document.createElement('br');
            positionsDiv.appendChild(label);
            positionsDiv.appendChild(select);
            positionsDiv.appendChild(br);
        });
    }


    // Function to add or update player stats
    function addOrUpdatePlayerStats() {
        const playerId = playerNameSelect.value;
        const gp = parseInt(gpInput.value.trim()) || 0;
        const goals = parseInt(goalsInput.value.trim()) || 0;
        const assists = parseInt(assistsInput.value.trim()) || 0;
        const shots = parseInt(shotsInput.value.trim()) || 0;
        const passes = parseInt(passesInput.value.trim()) || 0;
        const passAttempts = parseInt(passAttemptsInput.value.trim()) || 0;
        const saves = parseInt(savesInput.value.trim()) || 0;
        const conceded = parseInt(concededInput.value.trim()) || 0;
        const dribbles = parseInt(dribblesInput.value.trim()) || 0;
        const tackles = parseInt(tacklesInput.value.trim()) || 0;
        const offsides = parseInt(offsidesInput.value.trim()) || 0;
        const fouls = parseInt(foulsInput.value.trim()) || 0;
        const pw = parseInt(pwInput.value.trim()) || 0;
        const pl = parseInt(plInput.value.trim()) || 0;
        const rc = parseInt(rcInput.value.trim()) || 0;
        const motm = parseInt(motmInput.value.trim()) || 0;

        // Validation
        if (!playerId) {
            showMessage('Please select a player.', 'error');
            return;
        }

        const playerStatsRef = database.ref('player-stats').orderByChild('playerId').equalTo(playerId);
        playerStatsRef.once('value', snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const existingStats = childSnapshot.val();
                    const updatedStats = {
                        gp: existingStats.gp + gp,
                        goals: existingStats.goals + goals,
                        assists: existingStats.assists + assists,
                        shots: existingStats.shots + shots,
                        passes: existingStats.passes + passes,
                        passAttempts: existingStats.passAttempts + passAttempts,
                        saves: existingStats.saves + saves,
                        conceded: existingStats.conceded + conceded,
                        dribbles: existingStats.dribbles + dribbles,
                        tackles: existingStats.tackles + tackles,
                        offsides: existingStats.offsides + offsides,
                        fouls: existingStats.fouls + fouls,
                        pw: existingStats.pw + pw,
                        pl: existingStats.pl + pl,
                        rc: existingStats.rc + rc,
                        motm: existingStats.motm + motm
                    };
                    childSnapshot.ref.update(updatedStats)
                        .then(() => {
                            showMessage('Player stats updated successfully.', 'success');
                            fetchPlayerStats();
                            clearFormInputs();
                        })
                        .catch(error => {
                            showMessage('Error updating player stats: ' + error.message, 'error');
                        });
                });
            } else {
                const newPlayerStatsRef = database.ref('player-stats').push();
                newPlayerStatsRef.set({
                    playerId: playerId,
                    gp: gp,
                    goals: goals,
                    assists: assists,
                    shots: shots,
                    passes: passes,
                    passAttempts: passAttempts,
                    saves: saves,
                    conceded: conceded,
                    dribbles: dribbles,
                    tackles: tackles,
                    offsides: offsides,
                    fouls: fouls,
                    pw: pw,
                    pl: pl,
                    rc: rc,
                    motm: motm
                }).then(() => {
                    showMessage('Player stats added successfully.', 'success');
                    fetchPlayerStats();
                    clearFormInputs();
                }).catch(error => {
                    showMessage('Error adding player stats: ' + error.message, 'error');
                });
            }
        });
    }

    // Function to add a player
    function addPlayer() {
        const playerName = newPlayerInput.value.trim();
        const position = positionInput.value.trim();
        const discordUsername = discordUsernameInput.value.trim();

        if (!playerName) {
            showMessage('Player name is required.', 'error');
            return;
        }

        const newPlayerRef = database.ref('players').push();
        newPlayerRef.set({
            name: playerName,
            position: position,
            discordUsername: discordUsername
        }).then(() => {
            showMessage('Player added successfully.', 'success');
            initializePlayers().then(() => {
                console.log('Players initialized after adding new player.');
            }); // Refresh the player list
            newPlayerInput.value = '';
            positionInput.value = '';
            discordUsernameInput.value = '';
        }).catch(error => {
            showMessage('Error adding player: ' + error.message, 'error');
        });
    }

    // Function to remove a player
    function removePlayer() {
        const playerId = removePlayerSelect.value;

        if (!playerId) {
            showMessage('Please select a player to remove.', 'error');
            return;
        }

        const playerRef = database.ref('players').child(playerId);
        playerRef.remove()
            .then(() => {
                showMessage('Player removed successfully.', 'success');
                initializePlayers().then(() => {
                    console.log('Players initialized after removing player.');
                }); // Refresh the player list
            })
            .catch(error => {
                showMessage('Error removing player: ' + error.message, 'error');
            });
    }

    // Function to fetch and display player stats
    function fetchPlayerStats() {
        const playerStatsRef = database.ref('player-stats');
        playerStatsRef.once('value', snapshot => {
            const playerStatsTable = document.getElementById('player-stats-table').getElementsByTagName('tbody')[0];
            playerStatsTable.innerHTML = ''; // Clear existing table rows

            snapshot.forEach(childSnapshot => {
                const stats = childSnapshot.val();
                const newRow = playerStatsTable.insertRow();

                // Add cells to the row and set their values
                getPlayerNameById(stats.playerId).then(playerName => {
                    newRow.insertCell().textContent = playerName; // Player Name
                    newRow.insertCell().textContent = stats.gp;
                    newRow.insertCell().textContent = stats.goals;
                    newRow.insertCell().textContent = stats.assists;
                    newRow.insertCell().textContent = stats.shots;
                    newRow.insertCell().textContent = stats.passes;
                    newRow.insertCell().textContent = stats.passAttempts;
                    newRow.insertCell().textContent = stats.saves;
                    newRow.insertCell().textContent = stats.conceded;
                    newRow.insertCell().textContent = stats.dribbles;
                    newRow.insertCell().textContent = stats.tackles;
                    newRow.insertCell().textContent = stats.offsides;
                    newRow.insertCell().textContent = stats.fouls;
                    newRow.insertCell().textContent = stats.pw;
                    newRow.insertCell().textContent = stats.pl;
                    newRow.insertCell().textContent = stats.rc;
                    newRow.insertCell().textContent = stats.motm;

                    // Add delete button
                    const deleteCell = newRow.insertCell();
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function() {
                        deletePlayerStats(childSnapshot.key);
                    });
                    deleteCell.appendChild(deleteButton);
                });
            });
        });
    }

    // Function to delete player stats
    function deletePlayerStats(playerStatsId) {
        const playerStatsRef = database.ref('player-stats').child(playerStatsId);
        playerStatsRef.remove()
            .then(() => {
                showMessage('Player stats removed successfully.', 'success');
                fetchPlayerStats();
            })
            .catch(error => {
                showMessage('Error removing player stats: ' + error.message, 'error');
            });
    }

    // Get player name by ID
    function getPlayerNameById(playerId) {
        const playerRef = database.ref('players/' + playerId);
        return new Promise((resolve, reject) => {
            playerRef.once('value', snapshot => {
                const playerName = snapshot.val().name;
                resolve(playerName);
            }, error => {
                reject(error);
            });
        });
    }

    // Function to show messages
    function showMessage(message, type) {
        messageElement.textContent = message;
        messageElement.className = type;
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = '';
        }, 3000);
    }

    // Function to clear form inputs
    function clearFormInputs() {
        playerNameSelect.value = '';
        gpInput.value = '';
        goalsInput.value = '';
        assistsInput.value = '';
        shotsInput.value = '';
        passesInput.value = '';
        passAttemptsInput.value = '';
        savesInput.value = '';
        concededInput.value = '';
        dribblesInput.value = '';
        tacklesInput.value = '';
        offsidesInput.value = '';
        foulsInput.value = '';
        pwInput.value = '';
        plInput.value = '';
        rcInput.value = '';
        motmInput.value = '';
    }

    // Initialize player stats table
    function initializePlayerStatsTable() {
        fetchPlayerStats(); // Fetch and display player stats
    }

    // Initialize player stats table on page load
    initializePlayerStatsTable();

    // Add event listeners to forms and buttons
    addPlayerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addPlayer();
    });

    removePlayerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        removePlayer();
    });

    createFormationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formation = formationSelect.value;
        populatePositions(formation);
    });

    playerStatsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addOrUpdatePlayerStats();
    });

    // Initialize players list and select options on page load
    initializePlayers().then(() => {
        console.log('Players initialized.');
    }).catch(error => {
        console.error('Error initializing players:', error);
    });

        // Add click event listener to each panel link
        panelLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
    
                // Hide all sections
                sections.forEach(section => {
                    section.style.display = 'none';
                });
    
                // Show the targeted section
                const targetSection = document.getElementById(targetId);
                targetSection.style.display = 'block';
            });
        });
    });

