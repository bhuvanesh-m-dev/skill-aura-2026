// Get current URL
const currentUrl = window.location.href;
const certificateTitle = "PromptX 2026 - Certificate of Participation";
const certificateDesc = "Check out my Certificate of Participation from PromptX 2026 at Kings Engineering College!";

// Load Data and Initialize
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Certificate Landing Page Loaded');
    
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Update Common Data
        const teamNameEl = document.getElementById('team-name');
        const projectBtn = document.getElementById('projectBtn');
        const svgProjectLink = document.getElementById('svg-project-link');

        if (teamNameEl) teamNameEl.textContent = data.teamName;
        if (projectBtn) projectBtn.href = data.projectUrl;
        if (svgProjectLink) svgProjectLink.href = data.projectUrl;

        // Get Participant ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const participantId = urlParams.get('id');
        
        // Find and Update Participant
        let participant = null;
        if (participantId) {
            participant = data.participants.find(p => p.id === participantId);
        }

        // If no ID or invalid ID, redirect to 404 page
        if (!participant) {
            window.location.href = 'https://bhuvanesh-m-dev.github.io/skill-aura-2026/certificate/404/';
            return;
        }

        const nameEl = document.getElementById('participant-name');
        if (nameEl) nameEl.textContent = participant.name;
        document.title = `Certificate of Participation - ${participant.name} | PromptX 2026`;

        // Log Generation URLs for the user
        console.log("--- Certificate Generation URLs ---");
        const baseUrl = window.location.origin + window.location.pathname;
        data.participants.forEach(p => {
            console.log(`${p.name}: ${baseUrl}?id=${p.id}`);
        });
        console.log("-----------------------------------");

        // Admin Mode: Show links on screen if ?mode=admin is present
        if (urlParams.get('mode') === 'admin') {
            showAdminPanel(data.participants, baseUrl);
        }

    } catch (error) {
        console.error('Error loading certificate data:', error);
    }
});

// Copy to Clipboard Function
function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard');
        const copyBtn = document.querySelector('.btn-copy');
        const copyText = document.getElementById('copyText');

        copyBtn.classList.add('copied');
        copyText.textContent = 'Copied';

        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyText.textContent = 'Copy Link';
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copied to clipboard');
    });
}

// Share on WhatsApp
function shareWhatsApp(e) {
    e.preventDefault();
    const text = encodeURIComponent(`${certificateDesc} ${window.location.href}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400');
}

// Share on LinkedIn
function shareLinkedIn(e) {
    e.preventDefault();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
}

// Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Admin Panel Helper
function showAdminPanel(participants, baseUrl) {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: black;
        padding: 30px;
        z-index: 10000;
        border-radius: 10px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        font-family: sans-serif;
        border: 2px solid #000;
    `;

    const h2 = document.createElement('h2');
    h2.textContent = 'Participant Links';
    h2.style.marginBottom = '20px';
    h2.style.borderBottom = '2px solid #eee';
    container.appendChild(h2);

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '10px';

    participants.forEach(p => {
        const row = document.createElement('div');
        const link = `${baseUrl}?id=${p.id}`;
        row.innerHTML = `<strong>${p.name}</strong>: <br><a href="${link}" target="_blank" style="color:blue; word-break: break-all;">${link}</a>`;
        row.style.borderBottom = '1px solid #eee';
        row.style.paddingBottom = '10px';
        list.appendChild(row);
    });

    container.appendChild(list);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close Panel';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);

    document.body.appendChild(container);
}
