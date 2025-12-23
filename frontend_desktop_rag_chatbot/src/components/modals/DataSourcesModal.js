import React, { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../services/settingsService';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// PUBLIC_INTERFACE
export default function DataSourcesModal({ open, onClose }) {
  /**
   * Modal to manage local data sources list (files/folders).
   * Basic path validation and add/remove controls. In future, bind to IPC file pickers.
   */
  const [items, setItems] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [newType, setNewType] = useState('folder');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setItems(Array.isArray(s.dataSources.items) ? s.dataSources.items : []);
    setNewPath('');
    setNewType('folder');
    setErrors({});
  }, [open]);

  const validatePath = (p) => {
    if (!p || typeof p !== 'string') return 'Path is required';
    // very basic sanity checks; real validation will occur via IPC later
    if (p.length < 2) return 'Path appears too short';
    return null;
  };

  const handleAdd = () => {
    const err = validatePath(newPath);
    if (err) {
      setErrors({ newPath: err });
      return;
    }
    // prevent duplicates by path
    if (items.some((it) => it.path === newPath)) {
      setErrors({ newPath: 'This path is already added' });
      return;
    }
    const next = [...items, { id: uid(), path: newPath, type: newType }];
    setItems(next);
    setNewPath('');
    setNewType('folder');
    setErrors({});
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSave = () => {
    // must have at least 0; no strict requirement
    saveSettings({ dataSources: { items } });
    onClose?.();
  };

  const handlePick = async () => {
    if (typeof window === 'undefined' || !window.api) return;
    try {
      if (newType === 'folder' && window.api.pickFolder) {
        const res = await window.api.pickFolder();
        if (!res?.canceled && Array.isArray(res.filePaths) && res.filePaths[0]) {
          setNewPath(res.filePaths[0]);
        }
      } else if (newType === 'file' && window.api.pickFiles) {
        const res = await window.api.pickFiles({ allowMultiple: false });
        if (!res?.canceled && Array.isArray(res.filePaths) && res.filePaths[0]) {
          setNewPath(res.filePaths[0]);
        }
      }
    } catch {
      // swallow; remains manual input
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Data Sources">
      <div className="modal surface">
        <div className="modal-header">
          <h3 className="m-0">Data Sources</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <label className="label">Add source</label>
            <div className="grid-3">
              <select
                className="input"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="folder">Folder</option>
                <option value="file">File</option>
              </select>
              <input
                className="input"
                placeholder={newType === 'folder' ? 'e.g., /Users/me/Documents/Notes' : 'e.g., /Users/me/file.pdf'}
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={handleAdd}>Add</button>
                {typeof window !== 'undefined' && window.api && (
                  <button className="btn ghost" onClick={handlePick} title="Pick from system dialog">Browse…</button>
                )}
              </div>
            </div>
            {errors.newPath && <div className="error">{errors.newPath}</div>}
            <div className="muted mt-xs">You can type a path manually or use the Browse button in Electron.</div>
          </div>

          <div className="form-row">
            <label className="label">Current sources</label>
            {items.length === 0 ? (
              <div className="empty-state">No sources added yet.</div>
            ) : (
              <ul className="source-list">
                {items.map((it) => (
                  <li key={it.id} className="source-item">
                    <span className="badge">{it.type}</span>
                    <span className="path" title={it.path}>{it.path}</span>
                    <button className="btn ghost" onClick={() => handleRemove(it.id)} aria-label="Remove">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
