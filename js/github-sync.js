// GitHub Sync Management
const GITHUB_CONFIG_KEY = 'githubSyncConfig';
const SYNC_DATA_KEYS = ['geminiApiKey', 'fitnessPlanFoodDatabase', 'savedRecipes'];

const githubSyncModal = document.getElementById('github-sync-modal');
const githubSyncBtn = document.getElementById('github-sync-btn');
const closeGithubSyncModalBtn = document.getElementById('close-github-sync-modal-btn');
const githubSetupStep = document.getElementById('github-setup-step');
const githubActionStep = document.getElementById('github-action-step');
const githubTokenInput = document.getElementById('github-token-input');
const githubRepoInput = document.getElementById('github-repo-input');
const testGithubConnectionBtn = document.getElementById('test-github-connection-btn');
const githubSyncSaveBtn = document.getElementById('github-sync-save-btn');
const uploadDataBtn = document.getElementById('upload-data-btn');
const downloadDataBtn = document.getElementById('download-data-btn');
const backToSetupBtn = document.getElementById('back-to-setup-btn');
const syncStatusIcon = document.getElementById('sync-status-icon');
const syncStatusText = document.getElementById('sync-status-text');

function getGithubConfig() { 
    return JSON.parse(localStorage.getItem(GITHUB_CONFIG_KEY)) || null; 
}

function saveGithubConfig(config) { 
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config)); 
}

function showGithubSyncModal() {
    githubSyncModal.classList.remove('hidden');
    const config = getGithubConfig();
    if (config) {
        githubTokenInput.value = config.token;
        githubRepoInput.value = config.repo;
    }
}

function hideGithubSyncModal() {
    githubSyncModal.classList.add('hidden');
    showSetupStep();
}

function showSetupStep() {
    githubSetupStep.classList.remove('hidden');
    githubActionStep.classList.add('hidden');
}

function showActionStep() {
    githubSetupStep.classList.add('hidden');
    githubActionStep.classList.remove('hidden');
}

async function testGithubConnection() {
    const token = githubTokenInput.value.trim();
    const repo = githubRepoInput.value.trim();

    if (!token || !repo) {
        showNotification('กรุณากรอก Token และ Repository', true);
        return false;
    }

    try {
        testGithubConnectionBtn.textContent = 'กำลังทดสอบ...';
        testGithubConnectionBtn.disabled = true;

        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            showNotification('เชื่อมต่อ GitHub สำเร็จ!');
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        showNotification('ไม่สามารถเชื่อมต่อ GitHub ได้ กรุณาตรวจสอบ Token และ Repository', true);
        return false;
    } finally {
        testGithubConnectionBtn.textContent = 'ทดสอบการเชื่อมต่อ';
        testGithubConnectionBtn.disabled = false;
    }
}

async function saveGithubConfiguration() {
    const token = githubTokenInput.value.trim();
    const repo = githubRepoInput.value.trim();

    if (!token || !repo) {
        showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', true);
        return;
    }

    const isConnected = await testGithubConnection();
    if (!isConnected) return;

    saveGithubConfig({ token, repo });
    showNotification('บันทึกการตั้งค่า GitHub เรียบร้อยแล้ว');
    showActionStep();
}

function getAllSyncData() {
    const data = {};
    SYNC_DATA_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                data[key] = JSON.parse(value);
            } catch {
                data[key] = value;
            }
        }
    });
    data.lastSync = new Date().toISOString();
    return data;
}

function applySyncData(data) {
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        if (SYNC_DATA_KEYS.includes(key) && data[key] !== undefined) {
            const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
            localStorage.setItem(key, value);
        }
    });
    showNotification('นำเข้าข้อมูลเรียบร้อยแล้ว');
}

async function uploadDataToGithub() {
    const config = getGithubConfig();
    if (!config) {
        showNotification('กรุณาตั้งค่า GitHub ก่อน', true);
        return;
    }

    try {
        uploadDataBtn.textContent = 'กำลังอัพโหลด...';
        uploadDataBtn.disabled = true;
        syncStatusIcon.textContent = '⬆️';
        syncStatusText.textContent = 'กำลังอัพโหลดข้อมูล...';

        const data = getAllSyncData();
        console.log('Sync data to upload:', Object.keys(data));
        console.log('Data contains Thai text:', JSON.stringify(data).includes('ก'));
        
        // Handle Thai text encoding properly
        const jsonString = JSON.stringify(data, null, 2);
        const content = btoa(unescape(encodeURIComponent(jsonString)));
        console.log('Base64 encoded successfully, length:', content.length);

        // Always get the latest file info to ensure we have the correct SHA
        let sha = null;
        let isNewFile = false;
        
        try {
            const getResponse = await fetch(`https://api.github.com/repos/${config.repo}/contents/sync-data.json`, {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
                console.log('File exists, current SHA:', sha);
            } else if (getResponse.status === 404) {
                console.log('File does not exist, will create new file');
                isNewFile = true;
            } else {
                throw new Error(`Failed to check file existence: ${getResponse.status}`);
            }
        } catch (error) {
            console.error('Error checking file:', error);
            // If we can't check, assume it's a new file
            isNewFile = true;
        }

        const payload = {
            message: `${isNewFile ? 'Create' : 'Update'} sync data - ${new Date().toISOString()}`,
            content: content
        };
        
        // Only add SHA if file exists and we have it
        if (!isNewFile && sha) {
            payload.sha = sha;
        }

        console.log('Upload payload:', { 
            isNewFile, 
            hasSha: !!sha, 
            repo: config.repo, 
            payloadSize: JSON.stringify(payload).length 
        });

        syncStatusText.textContent = isNewFile ? 'กำลังสร้างไฟล์ใหม่...' : 'กำลังอัปเดตไฟล์...';

        const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/sync-data.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            syncStatusIcon.textContent = '✅';
            syncStatusText.textContent = 'อัพโหลดข้อมูลสำเร็จ!';
            showNotification(`${isNewFile ? 'สร้าง' : 'อัพเดต'}ไฟล์ข้อมูลใน GitHub สำเร็จ!`);
        } else {
            const errorData = await response.text();
            console.error('Upload failed:', response.status, errorData);
            console.error('Failed payload size:', JSON.stringify(payload).length);
            console.error('Response headers:', [...response.headers.entries()]);
            
            // Provide more specific error messages
            let errorMessage = 'ไม่สามารถอัพโหลดข้อมูลได้';
            if (response.status === 409) {
                errorMessage = 'ข้อมูลใน GitHub ได้รับการแก้ไขแล้ว กรุณาดาวน์โหลดข้อมูลล่าสุดก่อน';
            } else if (response.status === 404) {
                errorMessage = 'ไม่พบ Repository หรือไม่มีสิทธิ์เข้าถึง';
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = 'Token ไม่ถูกต้องหรือไม่มีสิทธิ์เขียนไฟล์';
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        syncStatusIcon.textContent = '❌';
        syncStatusText.textContent = 'อัพโหลดล้มเหลว';
        showNotification(error.message || 'ไม่สามารถอัพโหลดข้อมูลได้', true);
        console.error('Upload error:', error);
    } finally {
        uploadDataBtn.textContent = '⬆️ อัพโหลดข้อมูลไปยัง GitHub';
        uploadDataBtn.disabled = false;
    }
}

async function downloadDataFromGithub() {
    const config = getGithubConfig();
    if (!config) {
        showNotification('กรุณาตั้งค่า GitHub ก่อน', true);
        return;
    }

    try {
        downloadDataBtn.textContent = 'กำลังดาวน์โหลด...';
        downloadDataBtn.disabled = true;
        syncStatusIcon.textContent = '⬇️';
        syncStatusText.textContent = 'กำลังดาวน์โหลดข้อมูล...';

        const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/sync-data.json`, {
            headers: {
                'Authorization': `token ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const fileData = await response.json();
            // Handle Thai text decoding properly
            const content = decodeURIComponent(escape(atob(fileData.content)));
            const data = JSON.parse(content);
            
            applySyncData(data);
            syncStatusIcon.textContent = '✅';
            syncStatusText.textContent = 'ดาวน์โหลดข้อมูลสำเร็จ!';
            showNotification('ดาวน์โหลดข้อมูลจาก GitHub สำเร็จ!');
            
            // Refresh UI
            if (document.getElementById('food-database').classList.contains('active')) {
                renderCustomFoods();
            }
            if (document.getElementById('saved-recipes').classList.contains('active')) {
                renderSavedRecipes();
            }
        } else if (response.status === 404) {
            syncStatusIcon.textContent = '⚠️';
            syncStatusText.textContent = 'ไม่พบข้อมูลใน GitHub';
            showNotification('ไม่พบไฟล์ข้อมูลใน GitHub', true);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        syncStatusIcon.textContent = '❌';
        syncStatusText.textContent = 'ดาวน์โหลดล้มเหลว';
        showNotification('ไม่สามารถดาวน์โหลดข้อมูลได้', true);
        console.error('Download error:', error);
    } finally {
        downloadDataBtn.textContent = '⬇️ ดาวน์โหลดข้อมูลจาก GitHub';
        downloadDataBtn.disabled = false;
    }
}

// Auto-sync function (throttled to prevent too many API calls)
let syncTimeout = null;
async function autoSyncToGithub() {
    const config = getGithubConfig();
    if (!config) return;

    // Clear existing timeout
    if (syncTimeout) clearTimeout(syncTimeout);
    
    // Set new timeout (sync after 3 seconds of inactivity)
    syncTimeout = setTimeout(async () => {
        try {
            await uploadDataToGithub();
        } catch (error) {
            console.error('Auto-sync failed:', error);
        }
    }, 3000);
}

// Initialize GitHub sync event listeners
function initGithubSync() {
    githubSyncBtn.addEventListener('click', () => {
        const config = getGithubConfig();
        if (config) {
            showActionStep();
        } else {
            showSetupStep();
        }
        showGithubSyncModal();
    });

    closeGithubSyncModalBtn.addEventListener('click', hideGithubSyncModal);
    githubSyncModal.addEventListener('click', (e) => {
        if (e.target === githubSyncModal) hideGithubSyncModal();
    });

    testGithubConnectionBtn.addEventListener('click', testGithubConnection);
    githubSyncSaveBtn.addEventListener('click', saveGithubConfiguration);
    uploadDataBtn.addEventListener('click', uploadDataToGithub);
    downloadDataBtn.addEventListener('click', downloadDataFromGithub);
    backToSetupBtn.addEventListener('click', showSetupStep);
}
