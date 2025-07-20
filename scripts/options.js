// Saves options to chrome.storage
const saveOptions = () => {
  const extTriggerOption = document.getElementById('spdevlink-trigger').value;

  chrome.storage.sync.set(
    { extTrigger: extTriggerOption },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { extTrigger: 'both' },
    (items) => {
      document.getElementById('spdevlink-trigger').value = items.extTrigger;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);