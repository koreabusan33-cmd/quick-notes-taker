window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const saveBtn = document.getElementById('save');

    const savedNote = await window.electronAPI.loadNote();
    textarea.value = savedNote;
    // NEW: Save As button
    const saveAsBtn = document.getElementById('save-as');

    saveAsBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.saveAs(textarea.value);
        if (result.success) {
            lastSavedText = textarea.value;
            statusEl.textContent = `Saved to: ${result.filePath}`;
        } else {
            statusEl.textContent = 'Save As cancelled.';
        }
    });

    // Manual save
    saveBtn.addEventListener('click', async () => {
        try {
            await window.electronAPI.saveNote(textarea.value);
            alert('Note saved successfully!');            
        } catch (err) {
            console.error('Manual save failed:', err);            
        }
    });

    // NEW: New Note button
    const newNoteBtn = document.getElementById('new-note');
    newNoteBtn.addEventListener('click', async () => {
        // If no unsaved changes, clear immediately
        if (textarea.value === lastSavedText) {
            textarea.value = '';
            
        }
    })
});