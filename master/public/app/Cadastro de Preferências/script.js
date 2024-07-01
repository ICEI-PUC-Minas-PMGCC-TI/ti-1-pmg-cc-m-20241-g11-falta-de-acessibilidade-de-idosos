document.addEventListener('DOMContentLoaded', () => {
    const predefinedPreferences = ['Futebol', 'Culinária', 'Música', 'Cinema', 'TV', 'Notícias', 'Carros', 'Animais', 'Casa', 'Jogos'];
    const preferencesContainer = document.getElementById('preferences-container');
    const addPreferenceForm = document.getElementById('add-preference-form');
    const newPreferenceInput = document.getElementById('new-preference');
    const addPreferenceButton = document.getElementById('add-preference-button');
    const savePreferencesButton = document.getElementById('save-preferences-button');
    const showPreferencesButton = document.getElementById('show-preferences-button');
    const selectedPreferencesModal = document.getElementById('selected-preferences-modal');
    const selectedPreferencesContainer = document.getElementById('selected-preferences-container');
    const closeButton = document.querySelector('.close-button');

    const loadPreferences = () => {
        const selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        preferencesContainer.innerHTML = '';
        const allPreferences = [...new Set(predefinedPreferences.concat(selectedPreferences))];
        allPreferences.forEach(preference => {
            const div = document.createElement('div');
            div.className = 'preference';
            div.textContent = preference;
            if (selectedPreferences.includes(preference)) {
                div.classList.add('selected');
            }
            div.addEventListener('click', () => togglePreference(preference, div));
            preferencesContainer.appendChild(div);
        });
    };

    const togglePreference = (preference, element) => {
        let selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        if (selectedPreferences.includes(preference)) {
            selectedPreferences = selectedPreferences.filter(p => p !== preference);
            element.classList.remove('selected');
        } else {
            selectedPreferences.push(preference);
            element.classList.add('selected');
        }
        localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
    };

    addPreferenceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newPreference = newPreferenceInput.value.trim();
        if (!newPreference) {
            alert('Por favor, preencha este campo.');
            return;
        }
        let selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        if (newPreference && !predefinedPreferences.includes(newPreference) && !selectedPreferences.includes(newPreference)) {
            selectedPreferences.push(newPreference);
            localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
            loadPreferences();
            newPreferenceInput.value = '';
        }
    });

    addPreferenceButton.addEventListener('click', () => {
        addPreferenceForm.classList.toggle('hidden');
    });

    savePreferencesButton.addEventListener('click', () => {
        const selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        alert('Preferências salvas: ' + selectedPreferences.join(', '));
    });

    showPreferencesButton.addEventListener('click', () => {
        const selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        selectedPreferencesContainer.innerHTML = '';
        selectedPreferences.forEach(preference => {
            const div = document.createElement('div');
            div.className = 'preference';
            div.textContent = preference;
            selectedPreferencesContainer.appendChild(div);
        });
        selectedPreferencesModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        selectedPreferencesModal.classList.add('hidden');
    });

    loadPreferences();
});