import React, { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../services/settingsService';

// PUBLIC_INTERFACE
export default function RetrievalSettingsModal({ open, onClose }) {
  /**
   * Modal for retrieval pipeline configuration.
   * Fields: top-k, chunk size/overlap, reranking toggle.
   */
  const [topK, setTopK] = useState(5);
  const [chunkSize, setChunkSize] = useState(800);
  const [chunkOverlap, setChunkOverlap] = useState(150);
  const [reranking, setReranking] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setTopK(s.retrieval.topK ?? 5);
    setChunkSize(s.retrieval.chunkSize ?? 800);
    setChunkOverlap(s.retrieval.chunkOverlap ?? 150);
    setReranking(!!s.retrieval.reranking);
    setErrors({});
  }, [open]);

  const validate = () => {
    const e = {};
    const tk = Number(topK);
    const cs = Number(chunkSize);
    const co = Number(chunkOverlap);
    if (Number.isNaN(tk) || tk < 1 || tk > 100) e.topK = 'Top-K must be 1–100';
    if (Number.isNaN(cs) || cs < 64 || cs > 8000) e.chunkSize = 'Chunk size must be 64–8000';
    if (Number.isNaN(co) || co < 0 || co >= cs) e.chunkOverlap = 'Overlap must be 0 and less than chunk size';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    saveSettings({
      retrieval: {
        topK: Number(topK),
        chunkSize: Number(chunkSize),
        chunkOverlap: Number(chunkOverlap),
        reranking: !!reranking,
      },
    });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Retrieval Settings">
      <div className="modal surface">
        <div className="modal-header">
          <h3 className="m-0">Retrieval Settings</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row grid-3">
            <div>
              <label className="label">Top-K (1–100)</label>
              <input
                className="input"
                type="number"
                min="1"
                max="100"
                step="1"
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
              />
              {errors.topK && <div className="error">{errors.topK}</div>}
            </div>
            <div>
              <label className="label">Chunk size (64–8000)</label>
              <input
                className="input"
                type="number"
                min="64"
                max="8000"
                step="1"
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
              />
              {errors.chunkSize && <div className="error">{errors.chunkSize}</div>}
            </div>
            <div>
              <label className="label">Chunk overlap</label>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(e.target.value)}
              />
              {errors.chunkOverlap && <div className="error">{errors.chunkOverlap}</div>}
            </div>
          </div>

          <div className="form-row">
            <label className="label">Reranking</label>
            <div className="switch-row">
              <input
                id="reranking"
                type="checkbox"
                checked={reranking}
                onChange={(e) => setReranking(e.target.checked)}
              />
              <label htmlFor="reranking">Enable reranking step for improved relevance</label>
            </div>
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
