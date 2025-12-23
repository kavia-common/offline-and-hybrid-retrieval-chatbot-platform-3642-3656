import React, { useEffect, useMemo, useState } from 'react';
import { loadSettings, saveSettings } from '../../services/settingsService';

// PUBLIC_INTERFACE
export default function LLMSelectionModal({ open, onClose }) {
  /**
   * Modal for selecting LLM provider, model, temperature, and max tokens.
   * Persists via settingsService and supports basic validation.
   */
  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setProvider(s.llm.provider || 'OpenAI');
    setModel(s.llm.model || 'gpt-3.5-turbo');
    setTemperature(s.llm.temperature ?? 0.2);
    setMaxTokens(s.llm.maxTokens ?? 1024);
    setErrors({});
  }, [open]);

  const modelsByProvider = useMemo(() => ({
    OpenAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    Anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    'Local (GGUF)': ['llama-3-8b-instruct-q4', 'mistral-7b-instruct-q4', 'phi-3-mini'],
    Ollama: ['llama3:8b', 'mistral:7b', 'phi3:mini'],
  }), []);

  const validate = () => {
    const e = {};
    if (!provider) e.provider = 'Choose a provider';
    if (!model) e.model = 'Model name is required';
    const t = Number(temperature);
    if (Number.isNaN(t) || t < 0 || t > 2) e.temperature = 'Temperature must be between 0 and 2';
    const m = Number(maxTokens);
    if (Number.isNaN(m) || m < 1 || m > 32768) e.maxTokens = 'Max tokens must be 1–32768';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    saveSettings({
      llm: {
        provider,
        model,
        temperature: Number(temperature),
        maxTokens: Number(maxTokens),
      },
    });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="LLM Selection">
      <div className="modal surface">
        <div className="modal-header">
          <h3 className="m-0">LLM Selection</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <label className="label">Provider</label>
            <select
              className="input"
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                // Reset model to first suggestion when provider changes
                const arr = modelsByProvider[e.target.value] || [];
                if (arr.length > 0) setModel(arr[0]);
              }}
            >
              {Object.keys(modelsByProvider).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.provider && <div className="error">{errors.provider}</div>}
          </div>

          <div className="form-row">
            <label className="label">Model name</label>
            <input
              className="input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., gpt-4o-mini"
            />
            {errors.model && <div className="error">{errors.model}</div>}
            <div className="muted mt-xs">
              Suggestions: {(modelsByProvider[provider] || []).join(', ')}
            </div>
          </div>

          <div className="form-row grid-2">
            <div>
              <label className="label">Temperature (0–2)</label>
              <input
                className="input"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
              {errors.temperature && <div className="error">{errors.temperature}</div>}
            </div>
            <div>
              <label className="label">Max tokens (1–32768)</label>
              <input
                className="input"
                type="number"
                min="1"
                max="32768"
                step="1"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
              {errors.maxTokens && <div className="error">{errors.maxTokens}</div>}
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
