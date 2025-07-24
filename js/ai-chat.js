// AI Assistant Chat Feature
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

function addChatMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-bubble-${isUser ? 'user' : 'ai'} p-3 rounded-lg max-w-lg`;
    messageDiv.textContent = message;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage(message, true);
    chatInput.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-bubble-ai p-3 rounded-lg max-w-lg';
    typingDiv.innerHTML = 'กำลังพิมพ์... <div class="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>';
    typingDiv.id = 'typing-indicator';
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const prompt = `You are a professional fitness and nutrition assistant. The user is following a 3-month body transformation plan with 4 days of weight training per week and a specific nutrition plan. 

        User's question: ${message}
        
        Please provide helpful, accurate advice in Thai language. Keep responses concise but informative.`;
        
        const response = await callGemini(prompt);
        
        // Remove typing indicator
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
        
        addChatMessage(response);
    } catch (error) {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
        addChatMessage('ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    }
}

// Initialize AI Chat
function initAIChat() {
    sendChatBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}
