// Get current URL and extract team and participant info
const currentUrl = window.location.href;
const certificateTitle = "PromptX 2026 - Certificate of Participation";
const certificateDesc = "Check out my Certificate of Participation from PromptX 2026 at Kings Engineering College!";

// Extract team from URL path
function getTeamFromPath() {
    const path = window.location.pathname;
    // Match pattern: /team/[team-name]/ or /team/[team-name]/index.html
    const match = path.match(/\/team\/([^\/]+)/);
    return match ? match[1] : null;
}

// Load Data and Initialize
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Certificate Landing Page Loaded');
    
    try {
        // Get team from URL path
        const team = getTeamFromPath();
        
        // If no team in path, redirect to 404
        if (!team) {
            console.error('No team specified in URL path');
            window.location.href = 'https://bhuvanesh-m-dev.github.io/skill-aura-2026/certificate/404/';
            return;
        }

        // Construct path to team's data.json
        const dataPath = `team/${team}/data.json`;
        console.log(`Loading team data from: ${dataPath}`);
        
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`Team data not found for team: ${team}`);
        }
        
        const data = await response.json();
        
        // Update Common Data (team name and project URL)
        const teamNameEl = document.getElementById('team-name');
        const projectBtn = document.getElementById('projectBtn');
        const svgProjectLink = document.getElementById('svg-project-link');

        if (teamNameEl) teamNameEl.textContent = data.teamName;
        if (projectBtn) projectBtn.href = data.projectUrl;
        if (svgProjectLink) {
            svgProjectLink.setAttribute('href', data.projectUrl);
            svgProjectLink.setAttribute('target', '_blank');
            svgProjectLink.textContent = data.projectUrl;
        }

        // Get Participant ID from URL query parameter
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

        // Log Generation URLs for the user (for this team only)
        console.log("--- Certificate Generation URLs (Current Team) ---");
        const baseUrl = `${window.location.origin}/skill-aura-2026/certificate/team/${team}/`;
        data.participants.forEach(p => {
            console.log(`${p.name}: ${baseUrl}?id=${p.id}`);
        });
        console.log("--------------------------------------------------");

        // Admin Mode: Show links on screen if ?mode=admin is present
        if (urlParams.get('mode') === 'admin') {
            showAdminPanel(data.participants, baseUrl, data.teamName);
        }

    } catch (error) {
        console.error('Error loading certificate data:', error);
        // Redirect to 404 if data cannot be loaded
        window.location.href = 'https://bhuvanesh-m-dev.github.io/skill-aura-2026/certificate/404/';
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

// Admin Panel Helper (updated to show team name)
function showAdminPanel(participants, baseUrl, teamName) {
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
    h2.textContent = `Team: ${teamName} - Participant Links`;
    h2.style.marginBottom = '10px';
    h2.style.borderBottom = '2px solid #eee';
    container.appendChild(h2);

    const teamInfo = document.createElement('p');
    teamInfo.innerHTML = `<strong>Team Folder:</strong> ${getTeamFromPath()}`;
    teamInfo.style.marginBottom = '20px';
    teamInfo.style.padding = '10px';
    teamInfo.style.backgroundColor = '#f3f4f6';
    teamInfo.style.borderRadius = '5px';
    container.appendChild(teamInfo);

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '10px';

    participants.forEach(p => {
        const row = document.createElement('div');
        const link = `${baseUrl}?id=${p.id}`;
        row.innerHTML = `<strong>${p.name}</strong> (ID: ${p.id}): <br><a href="${link}" target="_blank" style="color:blue; word-break: break-all;">${link}</a>`;
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
    closeBtn.style.marginRight = '10px';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);

    const copyAllBtn = document.createElement('button');
    copyAllBtn.textContent = 'Copy All Links';
    copyAllBtn.style.marginTop = '20px';
    copyAllBtn.style.padding = '10px 20px';
    copyAllBtn.style.cursor = 'pointer';
    copyAllBtn.style.backgroundColor = '#3b82f6';
    copyAllBtn.style.color = 'white';
    copyAllBtn.style.border = 'none';
    copyAllBtn.style.borderRadius = '5px';
    copyAllBtn.onclick = () => {
        const links = participants.map(p => `${p.name}: ${baseUrl}?id=${p.id}`).join('\n');
        navigator.clipboard.writeText(links).then(() => {
            showToast('All links copied to clipboard');
        });
    };
    container.appendChild(copyAllBtn);

    document.body.appendChild(container);
}
