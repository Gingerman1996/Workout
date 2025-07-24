// API Key Management
const apikeyModal = document.getElementById('apikey-modal');
const setupApiKeyBtn = document.getElementById('setup-apikey-btn');
const closeApiKeyModalBtn = document.getElementById('close-apikey-modal-btn');
const saveApiKeyBtn = document.getElementById('save-apikey-btn');
const apikeyInput = document.getElementById('apikey-input');

function showApiKeyModal() { 
    apikeyModal.classList.remove('hidden'); 
    const key = getApiKey(); 
    if(key) apikeyInput.value = key; 
}

function hideApiKeyModal() { 
    apikeyModal.classList.add('hidden'); 
}

function getApiKey() { 
    return localStorage.getItem('geminiApiKey'); 
}

async function callGemini(prompt, imageBase64 = null, mimeType = null) {
    const apiKey = getApiKey();
    if (!apiKey) {
        showApiKeyModal();
        return "กรุณาตั้งค่า API Key ก่อนใช้งาน";
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    let parts = [{ text: prompt }];
    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: imageBase64
            }
        });
    }

    const payload = { contents: [{ parts: parts }] };

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();
        if (!response.ok) {
            if ([400, 401, 403].includes(response.status)) {
                localStorage.removeItem('geminiApiKey');
                showApiKeyModal();
                return "API Key ไม่ถูกต้อง กรุณาตั้งค่า API Key ใหม่";
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (result.candidates && result.candidates[0]?.content?.parts?.length > 0) {
            return result.candidates[0].content.parts[0].text;
        }
        return "ขออภัย, ไม่สามารถสร้างคำตอบได้ในขณะนี้";
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง";
    }
}

// Initialize API Key management
function initApiKey() {
    setupApiKeyBtn.addEventListener('click', showApiKeyModal);
    closeApiKeyModalBtn.addEventListener('click', hideApiKeyModal);
    apikeyModal.addEventListener('click', (e) => { 
        if (e.target === apikeyModal) hideApiKeyModal(); 
    });

    saveApiKeyBtn.addEventListener('click', async () => {
        const apiKey = apikeyInput.value.trim();
        if (!apiKey) { 
            showNotification('กรุณาใส่ API Key', true); 
            return; 
        }
        try {
            const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(testUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    contents: [{ role: "user", parts: [{ text: "Hello" }] }] 
                }) 
            });
            const data = await response.json();
            if (!response.ok || !data.candidates) throw new Error('Invalid API Key');
            localStorage.setItem('geminiApiKey', apiKey);
            hideApiKeyModal();
            showNotification('บันทึก API Key เรียบร้อยแล้ว');
            if (typeof autoSyncToGithub === 'function') {
                autoSyncToGithub();
            }
        } catch (error) {
            showNotification('API Key ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง', true);
        }
    });
}
