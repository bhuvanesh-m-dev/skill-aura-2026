// Certificate Script - Updated for NEW URL Structure
// Desired URLs: /certificate/team/titan/?id=member1   or   /certificate/team/1/?id=11
// Data is now loaded from: /certificate/team/{teamName}/data.json (relative fetch)

const certificateDesc = "Check out my Certificate of Participation from PromptX 2026 at Kings Engineering College!";

// Helper: Extract team name from URL path (/certificate/team/{teamName}/)
function getTeamFromPath() {
    const segments = window.location.pathname.split('/').filter(segment => segment.length > 0);
    
    for (let i = 0; i < segments.length - 1; i++) {
        if (segments[i].toLowerCase() === 'team') {
            return segments[i + 1];
        }
    }
    return null; // fallback if accessed directly
}

// Load Data and Initialize
document.addEventListener('DOMContentLoaded', async function () {
    console.log('✅ Certificate Landing Page Loaded');

    try {
        // 1. Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const participantId = urlParams.get('id');

        // 2. Extract team from PATH (new structure)
        let teamParam = getTeamFromPath();

        // Optional fallback to old ?team= query param (backward compatibility)
        if (!teamParam) {
            teamParam = urlParams.get('team');
        }

        if (!teamParam) {
            console.error('❌ No team found in URL path or query');
            window.location.href = 'https://bhuvanesh-m-dev.github.io/skill-aura-2026/certificate/404/';
            return;
        }

        // 3. Fetch data.json from the SAME team folder (relative = perfect for GitHub Pages)
        const dataPath = 'data.json';
        console.log(`📡 Fetching data from: ${dataPath} (team = ${teamParam})`);

        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - Check that data.json exists in /team/${teamParam}/`);
        }

        const data = await response.json();

        // Update common team data
        const teamNameEl = document.getElementById('team-name');
        const projectBtn = document.getElementById('projectBtn');
        const svgProjectLink = document.getElementById('svg-project-link');

        if (teamNameEl) teamNameEl.textContent = data.teamName || teamParam.toUpperCase();
        if (projectBtn) projectBtn.href = data.projectUrl || '#';
        if (svgProjectLink) {
            svgProjectLink.setAttribute('href', data.projectUrl || '#');
            svgProjectLink.setAttribute('target', '_blank');
            svgProjectLink.textContent = data.projectUrl || 'View Project';
        }

        // Find participant
        let participant = null;
        if (participantId) {
            participant = data.participants.find(p => p.id === participantId);
        }

        // Redirect to 404 if participant not found
        if (!participant) {
            window.location.href = 'https://bhuvanesh-m-dev.github.io/skill-aura-2026/certificate/404/';
            return;
        }

        // Update participant name
        const nameEl = document.getElementById('participant-name');
        if (nameEl) nameEl.textContent = participant.name;

        document.title = `Certificate of Participation - ${participant.name} | PromptX 2026`;

        // Log all participant links in the NEW correct format
        console.log("--- Certificate Generation URLs (New Path Format) ---");
        const baseUrl = `${window.location.origin}/skill-aura-2026/certificate/team/${teamParam}/`;
        
        data.participants.forEach(p => {
            console.log(`${p.name}: ${baseUrl}?id=${p.id}`);
        });
        console.log("-----------------------------------");

        // Admin Mode (if ?mode=admin)
        if (urlParams.get('mode') === 'admin') {
            showAdminPanel(data.participants, baseUrl);
        }

    } catch (error) {
        console.error('❌ Error loading certificate data:', error);
    }
});

// Copy to Clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard');
        const copyBtn = document.querySelector('.btn-copy');
        const copyText = document.getElementById('copyText');
        if (copyBtn) copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = 'Copied';
        setTimeout(() => {
            if (copyBtn) copyBtn.classList.remove('copied');
            if (copyText) copyText.textContent = 'Copy Link';
        }, 2000);
    }).catch(() => {
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

// Show Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Admin Panel - shows all links in new path format
function showAdminPanel(participants, baseUrl) {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; color: black; padding: 30px; z-index: 10000;
        border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        max-width: 90%; max-height: 90vh; overflow-y: auto;
        font-family: sans-serif; border: 2px solid #000;
    `;

    const h2 = document.createElement('h2');
    h2.textContent = 'Participant Links';
    h2.style.marginBottom = '20px';
    h2.style.borderBottom = '2px solid #eee';
    container.appendChild(h2);

    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '12px';

    participants.forEach(p => {
        const link = `${baseUrl}?id=${p.id}`;
        const row = document.createElement('div');
        row.innerHTML = `<strong>${p.name}</strong><br>
                         <a href="${link}" target="_blank" style="color:blue; word-break:break-all;">${link}</a>`;
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
