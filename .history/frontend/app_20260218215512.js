// Configuración
const API_URL = 'http://localhost:3000/api';
const logsContainer = document.getElementById('logs');
const statusIndicator = document.getElementById('statusIndicator');
const statusTitle = document.getElementById('statusTitle');
const statusMessage = document.getElementById('statusMessage');
const statusDetails = document.getElementById('statusDetails');
const timestamp = document.getElementById('timestamp');

// Utility Functions

function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
    
    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function updateStatus(status, title, message, details = '') {
    statusIndicator.className = `status-indicator ${status}`;
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    statusDetails.textContent = details;
    timestamp.textContent = new Date().toLocaleString();

    // Emojis según el estado
    const emojis = {
        success: '✅',
        error: '❌',
        loading: '⏳',
        warning: '⚠️'
    };

    if (status === 'success') {
        statusIndicator.textContent = '✓';
    } else if (status === 'error') {
        statusIndicator.textContent = '✕';
    } else if (status === 'loading') {
        statusIndicator.innerHTML = '<div class="loading-spinner"></div>';
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// API Functions

async function checkConnection() {
    try {
        updateStatus('loading', 'Verificando...', 'Conectando con la API...', '');
        addLog('Iniciando verificación de conexión...', 'info');

        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();

        if (response.ok && data.status === 'success') {
            updateStatus('success', '✅ Conexión Exitosa', '¡Todo está funcionando correctamente!', 'La API resto está conectada a Supabase');
            addLog('✅ Conexión exitosa con la API', 'success');
            showToast('Conexión verificada correctamente', 'success');
        } else {
            updateStatus('error', '❌ Error de Conexión', data.message, data.details || '');
            addLog(`❌ Error: ${data.message}`, 'error');
            showToast('Error al conectar', 'error');
        }
    } catch (error) {
        updateStatus('error', '❌ Error de Conexión', 'No se puede alcanzar la API', error.message);
        addLog(`❌ Error: ${error.message}`, 'error');
        showToast('No se puede conectar con la API. ¿Está ejecutándose?', 'error');
    }
}

async function loadData() {
    try {
        addLog('Cargando datos...', 'info');
        const loadDataBtn = document.getElementById('loadDataBtn');
        loadDataBtn.disabled = true;
        loadDataBtn.textContent = '⏳ Cargando...';

        const response = await fetch(`${API_URL}/data`);
        const result = await response.json();

        const dataList = document.getElementById('dataList');
        dataList.innerHTML = '';

        if (response.ok && result.status === 'success') {
            const data = result.data || [];
            
            if (data.length === 0) {
                dataList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>No hay datos en la base de datos</p>
                    </div>
                `;
                addLog('No hay datos en la base de datos', 'warning');
            } else {
                data.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'data-item';
                    itemDiv.innerHTML = `
                        <h4>${item.title || 'Sin título'}</h4>
                        <p>${item.description || 'Sin descripción'}</p>
                        <p><small>📅 ${item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</small></p>
                    `;
                    dataList.appendChild(itemDiv);
                });
                addLog(`✅ ${data.length} registro(s) cargado(s)`, 'success');
            }
        } else {
            dataList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <p>${result.message || 'Error al cargar datos'}</p>
                </div>
            `;
            addLog(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        document.getElementById('dataList').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <p>${error.message}</p>
            </div>
        `;
        addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
        const loadDataBtn = document.getElementById('loadDataBtn');
        loadDataBtn.disabled = false;
        loadDataBtn.textContent = '📋 Cargar datos';
    }
}

async function createData(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!title.trim() || !description.trim()) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        addLog('Enviando datos a la API...', 'info');

        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.trim(),
                description: description.trim()
            })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            addLog(`✅ Registro creado: "${title}"`, 'success');
            showToast('Registro creado exitosamente', 'success');
            document.getElementById('dataForm').reset();
            loadData(); // Recargar datos
        } else {
            addLog(`❌ Error: ${result.message}`, 'error');
            showToast(`Error: ${result.message}`, 'error');
        }
    } catch (error) {
        addLog(`❌ Error: ${error.message}`, 'error');
        showToast(`Error: ${error.message}`, 'error');
    }
}

function clearLogs() {
    logsContainer.innerHTML = '';
    addLog('Logs limpios', 'info');
}

// Event Listeners

document.getElementById('dataForm').addEventListener('submit', createData);

// Initial Check
window.addEventListener('load', () => {
    addLog('🚀 Aplicación cargada', 'info');
    checkConnection();
});
