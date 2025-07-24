// Custom Modals & Notification
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const choiceModal = document.getElementById('choice-modal');
const choiceTitle = document.getElementById('choice-title');
const choiceMessage = document.getElementById('choice-message');
const choiceButtons = document.getElementById('choice-buttons');
const inputModal = document.getElementById('input-modal');
const inputTitle = document.getElementById('input-title');
const inputMessage = document.getElementById('input-message');
const inputField = document.getElementById('input-field');
const inputOkBtn = document.getElementById('input-ok-btn');
const inputCancelBtn = document.getElementById('input-cancel-btn');
let inputCallback = null;

function showNotification(message, isError = false) {
    notificationMessage.textContent = message;
    notification.classList.toggle('bg-red-600', isError);
    notification.classList.toggle('bg-gray-800', !isError);
    notification.classList.add('show');
    setTimeout(() => { notification.classList.remove('show'); }, 3000);
}

function showChoiceModal(title, message, buttons) {
    choiceTitle.textContent = title;
    choiceMessage.textContent = message;
    choiceButtons.innerHTML = '';
    buttons.forEach(btnInfo => {
        const button = document.createElement('button');
        button.textContent = btnInfo.text;
        button.className = btnInfo.className;
        button.onclick = () => {
            choiceModal.classList.add('hidden');
            if (btnInfo.callback) btnInfo.callback();
        };
        choiceButtons.appendChild(button);
    });
    choiceModal.classList.remove('hidden');
}

function showInputModal(title, message, placeholder, callback) {
    inputTitle.textContent = title;
    inputMessage.textContent = message;
    inputField.value = placeholder || '';
    inputField.placeholder = placeholder || '';
    inputCallback = callback;
    inputModal.classList.remove('hidden');
    inputField.focus();
    inputField.select(); // Select all text for easy editing
}

// Initialize modals
function initModals() {
    inputOkBtn.addEventListener('click', () => {
        if (inputCallback) inputCallback(inputField.value.trim());
        inputModal.classList.add('hidden');
    });
    
    inputCancelBtn.addEventListener('click', () => {
        inputModal.classList.add('hidden');
    });

    // Handle Enter key in input field
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputCallback) inputCallback(inputField.value.trim());
            inputModal.classList.add('hidden');
        }
    });

    // Handle Escape key for modal close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!inputModal.classList.contains('hidden')) {
                inputModal.classList.add('hidden');
            }
            if (!choiceModal.classList.contains('hidden')) {
                choiceModal.classList.add('hidden');
            }
        }
    });
}
