window.addEventListener('DOMContentLoaded', async () => {
    const textarea    = document.getElementById('note');
    const titleInput  = document.getElementById('note-title');
    const saveBtn     = document.getElementById('save');
    const saveAsBtn   = document.getElementById('save-as');
    const openFileBtn = document.getElementById('open-file');
    const newNoteBtn  = document.getElementById('new-note');
    const deleteBtn   = document.getElementById('delete-note-btn');
    const noteList    = document.getElementById('note-list');
    const statusEl    = document.getElementById('save_status');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    let currentFontSize = 16;   
    function applyFontSize(size) {
        currentFontSize = Math.min(32, Math.max(10, size));
        textarea.style.fontSize = `${currentFontSize}px`; }
    fontIncreaseBtn.addEventListener('click', async () => {
        applyFontSize(currentFontSize + 2);
        await window.electronAPI.saveSettings({ fontSize: currentFontSize });
    });
    fontDecreaseBtn.addEventListener('click', async () => {
        applyFontSize(currentFontSize - 2);
        await window.electronAPI.saveSettings({ fontSize: currentFontSize });
    });
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    let isDarkMode = false;
    function applyDarkMode(enabled) {
        isDarkMode = enabled;
        if (enabled) {
            document.body.classList.add('dark-mode');
            darkModeBtn.textContent = '☀️ Light Mode';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeBtn.textContent = '🌙 Dark Mode';  }  }

    darkModeBtn.addEventListener('click', async () => {
        applyDarkMode(!isDarkMode);
        await window.electronAPI.saveSettings({ darkMode: isDarkMode });
    });
    let notes = [];              
    let currentNoteId = null;    
    let lastSavedContent = '';   
    let debounceTimer = null;    
    const searchInput = document.getElementById('search');
    function renderNoteList(filter = '') {
        noteList.innerHTML = '';
        
        const filtered = filter.trim() === ''
            ? notes
            : notes.filter(note => 
                (note.title || '').toLowerCase().includes(filter.toLowerCase()) ||
                (note.content || '').toLowerCase().includes(filter.toLowerCase())
              );
        filtered.forEach(note => {
            const item = document.createElement('div');
            item.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
            item.innerHTML = `
                <button class="note-item-delete" data-id="${note.id}">×</button>
                <div class="note-item-title">${note.title || 'Untitled Note'}</div>
                <div class="note-item-date">${new Date(note.updatedAt).toLocaleDateString()}</div>
            `;
            item.addEventListener('click', async (e) => {
                if (e.target.classList.contains('note-item-delete')) return; 
                await switchNote(note.id);
            });
            item.querySelector('.note-item-delete').addEventListener('click', async (e) => {
                e.stopPropagation(); 
                await deleteNote(note.id);
            });
            noteList.appendChild(item);
        }); }
    searchInput.addEventListener('input', () => {
        renderNoteList(searchInput.value);
    });
    function updateWordCount() {
        const text = textarea.value;
        const characters = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const wordCountEl = document.getElementById('word-count');
        if (wordCountEl) {
            wordCountEl.textContent = `Words: ${words} | Characters: ${characters}`;
        }  }
    async function switchNote(id) {
        if (textarea.value !== lastSavedContent) {
            const result = await window.electronAPI.newNote();
            if (!result.confirmed) return;    }
        const note = notes.find(n => n.id === id);
        if (!note) return;
        currentNoteId = note.id;
        titleInput.value = note.title || '';
        textarea.value = note.content || '';
        lastSavedContent = note.content || '';
        if (statusEl) statusEl.textContent = '';
        updateWordCount();
        renderNoteList(searchInput.value); 
    }
    async function saveCurrentNote() {
        if (!currentNoteId) return;
        const note = {
            id: currentNoteId,
            title: titleInput.value.trim() || 'Untitled Note',
            content: textarea.value
        };
        await window.electronAPI.saveNoteJson(note);
        lastSavedContent = textarea.value;
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index === -1) {
            notes.push({ ...note, updatedAt: new Date().toISOString() });
        } else {
            notes[index] = { ...notes[index], ...note, updatedAt: new Date().toISOString() };   }
        notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        renderNoteList(searchInput.value);
      if (statusEl) statusEl.textContent = `Saved at ${new Date().toLocaleTimeString()}`;  }
    async function deleteNote(id) {
        if (!id) return; // Guard clause if no note is active
        const result = await window.electronAPI.newNote(); 
        if (!result.confirmed) return;
        await window.electronAPI.deleteNote(id); 
        notes = notes.filter(n => n.id !== id);  
        if (currentNoteId === id) {
            currentNoteId = null;
            titleInput.value = '';
            textarea.value = '';
            lastSavedContent = '';
            if (statusEl) statusEl.textContent = 'Note deleted.';
            updateWordCount();    }
        renderNoteList(searchInput.value);   }
    deleteBtn.addEventListener('click', async () => {
        if (!currentNoteId) {
            if (statusEl) statusEl.textContent = 'No active note selected to delete.';
            return;   }
        await deleteNote(currentNoteId);
    });
    function startAutoSaveDebounce() {
        if (statusEl) statusEl.textContent = 'Changes detected — auto-saving in 5s...';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (textarea.value !== lastSavedContent) {
                saveCurrentNote();  }
        }, 5000);   }
    saveBtn.addEventListener('click', async () => {
        await saveCurrentNote();
        new Notification({
            title: 'Note Saved',
            body: `"${titleInput.value || 'Untitled Note'}" has been saved.`
        }).show();  })
        ;
    textarea.addEventListener('input', () => {
        updateWordCount();
        startAutoSaveDebounce();
    });
    titleInput.addEventListener('input', startAutoSaveDebounce);
    newNoteBtn.addEventListener('click', async () => {
        if (textarea.value !== lastSavedContent) {
            const result = await window.electronAPI.newNote();
            if (!result.confirmed) return;    }
        currentNoteId = 'note_' + Date.now();
        titleInput.value = '';
        textarea.value = '';
        lastSavedContent = '';
        if (statusEl) statusEl.textContent = 'New clean slate ready.';
        updateWordCount();
        document.querySelectorAll('.note-item').forEach(el => el.classList.remove('active'));
    });
    openFileBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            currentNoteId = 'note_' + Date.now();
            titleInput.value = result.filePath.split(/[\\/]/).pop() || 'Imported File';
            textarea.value = result.content;
            lastSavedContent = result.content;
            if (statusEl) statusEl.textContent = `Imported: ${result.filePath}`;
            updateWordCount();
            await saveCurrentNote();    }
    });

    saveAsBtn.addEventListener('click', async () => {
        await window.electronAPI.saveAs(textarea.value);
    });
    window.electronAPI.onMenuAction('menu-new-note', () => newNoteBtn.click());
    window.electronAPI.onMenuAction('menu-open-file', () => openFileBtn.click());
    window.electronAPI.onMenuAction('menu-save', () => saveBtn.click());
    window.electronAPI.onMenuAction('menu-save-as', () => saveAsBtn.click());
    try {
        const settings = await window.electronAPI.getSettings();
        applyFontSize(settings.fontSize || 16);
        applyDarkMode(settings.darkMode || false); 
        notes = await window.electronAPI.getNotes();
        if (notes && notes.length > 0) {
            notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            currentNoteId = notes[0].id;
            titleInput.value = notes[0].title || '';
            textarea.value = notes[0].content || '';
            lastSavedContent = notes[0].content || '';
        } else {
            currentNoteId = 'note_' + Date.now(); }
        updateWordCount();
        renderNoteList(searchInput.value); 
    } catch (err) {
        console.error("Application bootstrapping runtime exception encountered:", err);
    }
});
