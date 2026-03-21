import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios';

const LIMIT = 50;

function formatSize(bytes) {
  if (bytes == null || Number(bytes) === 0) return '0 B';
  const n = Number(bytes);
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), sizes.length - 1);
  const val = n / k ** i;
  const decimals = i === 0 ? 0 : val >= 100 ? 0 : val >= 10 ? 1 : 2;
  return `${parseFloat(val.toFixed(decimals))} ${sizes[i]}`;
}

const CATEGORY_COLORS = {
  document: { bg: '#ecfdf5', stroke: '#16a34a' },
  video: { bg: '#faf5ff', stroke: '#a855f7' },
  audio: { bg: '#fff7ed', stroke: '#ea580c' },
  image: { bg: '#eff6ff', stroke: '#0ea5e9' },
};

function CategoryIcon({ category, size = 40 }) {
  const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.document;
  const s = size;
  if (category === 'video') {
    return (
      <div style={{ ...ic.wrap, width: s, height: s, background: c.bg }}>
        <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      </div>
    );
  }
  if (category === 'audio') {
    return (
      <div style={{ ...ic.wrap, width: s, height: s, background: c.bg }}>
        <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ ...ic.wrap, width: s, height: s, background: c.bg }}>
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  );
}

const ic = {
  wrap: {
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

function UploadModal({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const reset = () => {
    setSelected([]);
    setProgress(0);
    setError('');
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const addFiles = (fileList) => {
    const arr = Array.from(fileList || []);
    setSelected((prev) => {
      const map = new Map(prev.map((f) => [`${f.name}-${f.size}`, f]));
      arr.forEach((f) => map.set(`${f.name}-${f.size}`, f));
      return Array.from(map.values());
    });
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (selected.length === 0) return;
    setUploading(true);
    setProgress(0);
    setError('');
    const formData = new FormData();
    selected.forEach((f) => formData.append('files', f));
    try {
      await api.post('/media/upload-bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={um.overlay} onClick={onClose}>
      <div style={um.box} onClick={(e) => e.stopPropagation()}>
        <div style={um.header}>
          <h3 style={um.title}>Upload files</h3>
          <button type="button" style={um.closeBtn} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div style={um.body}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ ...um.dropZone, ...(dragOver ? um.dropZoneActive : {}) }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => addFiles(e.target.files)}
            />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={um.dropTitle}>Drag and drop files here</p>
            <p style={um.dropHint}>or click to browse</p>
          </div>

          {selected.length > 0 && (
            <div style={um.fileList}>
              <p style={um.fileListTitle}>{selected.length} file(s) selected</p>
              <ul style={um.ul}>
                {selected.map((f) => (
                  <li key={`${f.name}-${f.size}`} style={um.li}>
                    <span style={um.fileName}>{f.name}</span>
                    <span style={um.fileMeta}>{formatSize(f.size)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uploading && (
            <div style={um.progressWrap}>
              <div style={um.progressBar}>
                <div style={{ ...um.progressFill, width: `${progress}%` }} />
              </div>
              <span style={um.progressText}>{progress}%</span>
            </div>
          )}

          {error && <p style={um.err}>{error}</p>}

          <div style={um.actions}>
            <button type="button" style={um.btnGhost} onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button
              type="button"
              style={{ ...um.btnPrimary, opacity: selected.length === 0 || uploading ? 0.5 : 1 }}
              onClick={handleUpload}
              disabled={selected.length === 0 || uploading}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ fileId, onClose, onDeleted }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/media/${fileId}`);
        if (!cancelled) setData(res.data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fileId]);

  const handleDelete = async () => {
    if (!data || !window.confirm(`Delete “${data.originalName}”? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/media/${data._id}`);
      onDeleted(data._id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  if (!fileId) return null;

  return (
    <div style={dm.overlay} onClick={onClose}>
      <div style={dm.box} onClick={(e) => e.stopPropagation()}>
        <div style={dm.header}>
          <h3 style={dm.title}>File details</h3>
          <button type="button" style={dm.closeBtn} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div style={dm.body}>
          {loading && <p style={dm.muted}>Loading…</p>}
          {!loading && !data && <p style={dm.err}>Could not load file.</p>}
          {!loading && data && (
            <>
              <div style={dm.previewArea}>
                {data.category === 'image' ? (
                  <img src={data.url} alt="" style={dm.previewImg} />
                ) : (
                  <div style={dm.previewIcon}>
                    <CategoryIcon category={data.category} size={96} />
                  </div>
                )}
              </div>
              <div style={dm.rows}>
                <div style={dm.row}>
                  <span style={dm.label}>Name</span>
                  <span style={dm.value}>{data.originalName}</span>
                </div>
                <div style={dm.row}>
                  <span style={dm.label}>Type</span>
                  <span style={dm.value}>{data.mimeType}</span>
                </div>
                <div style={dm.row}>
                  <span style={dm.label}>Size</span>
                  <span style={dm.value}>{formatSize(data.size)}</span>
                </div>
                <div style={dm.row}>
                  <span style={dm.label}>Category</span>
                  <span style={{ ...dm.value, textTransform: 'capitalize' }}>{data.category}</span>
                </div>
                <div style={dm.row}>
                  <span style={dm.label}>Uploaded</span>
                  <span style={dm.value}>
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })
                      : '—'}
                  </span>
                </div>
                <div style={dm.row}>
                  <span style={dm.label}>Uploaded by</span>
                  <span style={dm.value}>
                    {data.uploadedBy?.name || '—'}
                  </span>
                </div>
              </div>
              <div style={dm.usedBySection}>
                <p style={dm.usedByTitle}>Used in</p>
                {Array.isArray(data.usedBy) && data.usedBy.length > 0 ? (
                  <ul style={dm.usedByList}>
                    {data.usedBy.map((u, i) => (
                      <li key={i} style={dm.usedByItem}>
                        {u.model} — {u.field || '—'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={dm.muted}>Not used anywhere</p>
                )}
              </div>
              <button
                type="button"
                style={{ ...dm.deleteBtn, opacity: deleting ? 0.6 : 1 }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete file'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'audio', label: 'Audio' },
  { key: 'document', label: 'Documents' },
];

export default function AdminMedia() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const runSync = useCallback(async (silent = false) => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await api.post('/media/sync');
      if (!silent && res.data?.synced > 0) {
        setSyncDone(true);
        setTimeout(() => setSyncDone(false), 3000);
      }
      return res.data?.synced || 0;
    } catch (e) {
      console.error('Media sync error:', e);
      return 0;
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/media/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchList = useCallback(async (opts = {}) => {
    const nextOffset = opts.offset ?? 0;
    const append = opts.append ?? false;
    if (append) setLoadingMore(true);
    else setListLoading(true);
    try {
      const params = { limit: LIMIT, offset: nextOffset };
      if (category && category !== 'all') params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/media', { params });
      const { files: nextFiles, total: t } = res.data;
      setTotal(t);
      setOffset(nextOffset);
      if (append) {
        setFiles((prev) => [...prev, ...nextFiles]);
      } else {
        setFiles(nextFiles);
      }
    } catch (e) {
      console.error(e);
      if (!append) setFiles([]);
    } finally {
      setListLoading(false);
      setLoadingMore(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    let mounted = true;
    const autoSync = async () => {
      const synced = await runSync(true);
      if (mounted && synced > 0) {
        fetchStats();
        fetchList({ offset: 0, append: false });
      }
    };
    autoSync();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchList({ offset: 0, append: false });
  }, [category, search, fetchList]);

  const handleLoadMore = () => {
    if (files.length >= total) return;
    fetchList({ offset: offset + LIMIT, append: true });
  };

  const handleUploaded = () => {
    fetchStats();
    fetchList({ offset: 0, append: false });
  };

  const handleDeletedFromDetail = (id) => {
    setFiles((prev) => prev.filter((f) => f._id !== id));
    setTotal((t) => Math.max(0, t - 1));
    fetchStats();
  };

  const handleDeleteRow = async (id, name) => {
    if (!window.confirm(`Delete “${name}”?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/media/${id}`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      fetchStats();
      if (detailId === id) setDetailId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const byCat = stats?.byCategory || {};
  const imgCount = byCat.image?.count ?? 0;
  const docCount = byCat.document?.count ?? 0;
  const vidCount = byCat.video?.count ?? 0;
  const audCount = byCat.audio?.count ?? 0;

  const initialPageLoading = listLoading && files.length === 0 && offset === 0;

  return (
    <div>
      <style>{`@keyframes media-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={st.headerRow}>
        <div>
          <h1 style={st.title}>Media Library</h1>
          <p style={st.subtitle}>Upload, organize, and manage church media assets</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {syncDone && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Synced!</span>}
          <button
            type="button"
            style={st.syncBtn}
            disabled={syncing}
            onClick={async () => {
              const synced = await runSync(false);
              if (synced > 0) {
                fetchStats();
                fetchList({ offset: 0, append: false });
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={syncing ? { animation: 'media-spin 1s linear infinite' } : {}}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {syncing ? 'Syncing...' : 'Sync Files'}
          </button>
          <button type="button" style={st.uploadBtn} onClick={() => setUploadOpen(true)}>
            Upload Files
          </button>
        </div>
      </div>

      <div style={st.statsGrid}>
        <div style={st.statCard}>
          <div style={st.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Total Files</p>
            <p style={st.statValue}>{statsLoading ? '…' : stats?.totalFiles ?? 0}</p>
          </div>
        </div>
        <div style={st.statCard}>
          <div style={{ ...st.statIconWrap, background: '#f0fdf4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Total Size</p>
            <p style={st.statValue}>{statsLoading ? '…' : formatSize(stats?.totalSize)}</p>
          </div>
        </div>
        <div style={st.statCard}>
          <div style={{ ...st.statIconWrap, background: '#eff6ff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Images</p>
            <p style={st.statValue}>{statsLoading ? '…' : imgCount}</p>
          </div>
        </div>
        <div style={st.statCard}>
          <div style={{ ...st.statIconWrap, background: '#ecfdf5' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Documents</p>
            <p style={st.statValue}>{statsLoading ? '…' : docCount}</p>
          </div>
        </div>
        <div style={st.statCard}>
          <div style={{ ...st.statIconWrap, background: '#faf5ff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Videos</p>
            <p style={st.statValue}>{statsLoading ? '…' : vidCount}</p>
          </div>
        </div>
        <div style={st.statCard}>
          <div style={{ ...st.statIconWrap, background: '#fff7ed' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div>
            <p style={st.statLabel}>Audio</p>
            <p style={st.statValue}>{statsLoading ? '…' : audCount}</p>
          </div>
        </div>
      </div>

      <div style={st.toolbar}>
        <div style={st.tabsWrap}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCategory(tab.key)}
              style={{
                ...st.tab,
                ...(category === tab.key ? st.tabActive : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={st.toolbarRight}>
          <div style={st.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search by filename…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={st.searchInput}
            />
          </div>
          <div style={st.viewToggle}>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView('grid')}
              style={{
                ...st.viewBtn,
                ...(view === 'grid' ? st.viewBtnActive : {}),
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView('list')}
              style={{
                ...st.viewBtn,
                ...(view === 'list' ? st.viewBtnActive : {}),
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div style={st.card}>
        {initialPageLoading ? (
          <div style={st.empty}>
            <p style={st.emptyTitle}>Loading media…</p>
          </div>
        ) : files.length === 0 ? (
          <div style={st.empty}>
            <p style={st.emptyTitle}>No files found</p>
            <p style={st.emptySub}>Upload files or adjust filters.</p>
          </div>
        ) : view === 'grid' ? (
          <div style={st.grid}>
            {files.map((f) => (
              <button
                key={f._id}
                type="button"
                onClick={() => setDetailId(f._id)}
                style={st.gridCard}
              >
                <div style={st.gridThumb}>
                  {f.category === 'image' ? (
                    <img src={f.url} alt="" style={st.gridImg} />
                  ) : (
                    <div style={st.gridIconWrap}>
                      <CategoryIcon category={f.category} size={56} />
                    </div>
                  )}
                </div>
                <div style={st.gridMeta}>
                  <p style={st.gridName} title={f.originalName}>{f.originalName}</p>
                  <p style={st.gridSub}>
                    {formatSize(f.size)}
                    {' · '}
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })
                      : '—'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="admin-table-wrap" style={st.tableWrap}>
            <table style={st.table}>
              <thead>
                <tr>
                  <th style={{ ...st.th, width: 72 }}> </th>
                  <th style={st.th}>Name</th>
                  <th style={st.th}>Type</th>
                  <th style={st.th}>Size</th>
                  <th style={st.th}>Date</th>
                  <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f._id} style={st.tr}>
                    <td style={st.td}>
                      <button
                        type="button"
                        onClick={() => setDetailId(f._id)}
                        style={st.previewBtn}
                      >
                        {f.category === 'image' ? (
                          <img src={f.url} alt="" style={st.tableThumb} />
                        ) : (
                          <CategoryIcon category={f.category} size={44} />
                        )}
                      </button>
                    </td>
                    <td style={st.td}>
                      <button
                        type="button"
                        onClick={() => setDetailId(f._id)}
                        style={st.nameLink}
                      >
                        {f.originalName}
                      </button>
                    </td>
                    <td style={{ ...st.td, fontSize: 13, color: '#475569' }}>{f.mimeType}</td>
                    <td style={{ ...st.td, fontSize: 13, color: '#334155', fontWeight: 600 }}>
                      {formatSize(f.size)}
                    </td>
                    <td style={{ ...st.td, fontSize: 13, color: '#64748b' }}>
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                        : '—'}
                    </td>
                    <td style={{ ...st.td, textAlign: 'right' }}>
                      <button
                        type="button"
                        style={st.deleteBtn}
                        disabled={deletingId === f._id}
                        onClick={() => handleDeleteRow(f._id, f.originalName)}
                      >
                        {deletingId === f._id ? '…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 0 && (
        <div style={st.pagination}>
          <p style={st.pageInfo}>
            Showing {files.length} of {total}
          </p>
          {files.length < total && (
            <button
              type="button"
              style={st.loadMoreBtn}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
      <DetailModal
        fileId={detailId}
        onClose={() => setDetailId(null)}
        onDeleted={handleDeletedFromDetail}
      />
    </div>
  );
}

const um = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 14, maxWidth: 480, width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
  },
  title: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 22, color: '#94a3b8',
    cursor: 'pointer', lineHeight: 1,
  },
  body: { padding: '20px 24px 24px' },
  dropZone: {
    border: '2px dashed #cbd5e1', borderRadius: 12, padding: '32px 20px',
    textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  dropZoneActive: { borderColor: '#0ea5e9', background: '#f0f9ff' },
  dropTitle: { margin: 0, fontSize: 15, fontWeight: 600, color: '#334155' },
  dropHint: { margin: 0, fontSize: 13, color: '#64748b' },
  fileList: { marginTop: 16 },
  fileListTitle: { fontSize: 12, fontWeight: 700, color: '#64748b', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  ul: { listStyle: 'none', margin: 0, padding: 0, maxHeight: 160, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 10 },
  li: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', borderBottom: '1px solid #f8fafc', fontSize: 13,
  },
  fileName: { color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' },
  fileMeta: { color: '#64748b', flexShrink: 0 },
  progressWrap: { marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 },
  progressBar: { flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#0ea5e9', borderRadius: 4, transition: 'width 0.15s ease' },
  progressText: { fontSize: 12, fontWeight: 700, color: '#64748b', minWidth: 36 },
  err: { color: '#dc2626', fontSize: 13, marginTop: 12, marginBottom: 0 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  btnGhost: {
    padding: '9px 18px', fontSize: 13, fontWeight: 600, color: '#64748b',
    background: '#f1f5f9', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  },
  btnPrimary: {
    padding: '9px 18px', fontSize: 13, fontWeight: 700, color: '#fff',
    background: '#0ea5e9', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  },
};

const dm = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 14, maxWidth: 520, width: '100%',
    maxHeight: '90vh', overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff', zIndex: 1,
  },
  title: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 22, color: '#94a3b8',
    cursor: 'pointer', lineHeight: 1,
  },
  body: { padding: '20px 24px 24px' },
  muted: { color: '#64748b', fontSize: 14, margin: 0 },
  err: { color: '#dc2626', fontSize: 14 },
  previewArea: {
    borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9',
    minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden',
  },
  previewImg: { maxWidth: '100%', maxHeight: 320, display: 'block', objectFit: 'contain' },
  previewIcon: { padding: 24 },
  rows: { marginBottom: 20 },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '10px 0', borderBottom: '1px solid #f8fafc', gap: 16,
  },
  label: { fontSize: 13, color: '#64748b', fontWeight: 500, flexShrink: 0 },
  value: { fontSize: 13, color: '#0f172a', fontWeight: 700, textAlign: 'right', wordBreak: 'break-all' },
  usedBySection: { marginBottom: 20 },
  usedByTitle: { fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 10px' },
  usedByList: { margin: 0, paddingLeft: 18, color: '#334155', fontSize: 14 },
  usedByItem: { marginBottom: 6 },
  deleteBtn: {
    width: '100%', padding: '11px 16px', fontSize: 14, fontWeight: 700, color: '#fff',
    background: '#dc2626', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  },
};

const st = {
  headerRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap',
  },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  uploadBtn: {
    padding: '10px 22px', fontSize: 14, fontWeight: 700, color: '#fff',
    background: '#0ea5e9', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
  },
  syncBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#334155',
    background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '16px 18px',
    border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  statIconWrap: {
    width: 40, height: 40, borderRadius: 10, background: '#eff6ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statLabel: { fontSize: 11, color: '#64748b', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' },
  statValue: { fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, marginBottom: 16, flexWrap: 'wrap',
  },
  toolbarRight: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  tabsWrap: {
    display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, flexWrap: 'wrap',
  },
  tab: {
    padding: '7px 14px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: 'inherit',
  },
  tabActive: {
    background: '#fff', color: '#0ea5e9', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#fff', minWidth: 220,
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13, color: '#334155',
    fontFamily: 'inherit', flex: 1, background: 'transparent', minWidth: 0,
  },
  viewToggle: {
    display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4,
  },
  viewBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer',
    background: 'transparent', color: '#64748b', fontFamily: 'inherit',
  },
  viewBtnActive: {
    background: '#fff', color: '#0ea5e9', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  card: {
    background: '#fff', borderRadius: 14,
    border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
  },
  empty: { padding: '56px 32px', textAlign: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: '#334155', margin: '0 0 6px' },
  emptySub: { fontSize: 14, color: '#64748b', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 16,
    padding: 20,
  },
  gridCard: {
    textAlign: 'left', border: '1px solid #f1f5f9', borderRadius: 14, background: '#fff',
    padding: 0, overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s ease',
  },
  gridThumb: {
    aspectRatio: '4/3', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderBottom: '1px solid #f1f5f9',
  },
  gridImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  gridIconWrap: { padding: 16 },
  gridMeta: { padding: '12px 14px 14px' },
  gridName: {
    margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  gridSub: { margin: '6px 0 0', fontSize: 12, color: '#64748b' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#64748b',
    textAlign: 'left', borderBottom: '1px solid #f1f5f9',
    textTransform: 'uppercase', letterSpacing: '0.04em', background: '#f8fafc',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 18px', verticalAlign: 'middle' },
  previewBtn: {
    padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', display: 'flex',
  },
  tableThumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 8, display: 'block' },
  nameLink: {
    background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 600, color: '#0ea5e9',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
  },
  deleteBtn: {
    padding: '5px 14px', fontSize: 13, fontWeight: 600, color: '#ef4444',
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  pagination: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 18, flexWrap: 'wrap', gap: 12,
  },
  pageInfo: { fontSize: 13, color: '#64748b', margin: 0 },
  loadMoreBtn: {
    padding: '9px 20px', fontSize: 13, fontWeight: 700, color: '#0ea5e9',
    background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: 10,
    cursor: 'pointer', fontFamily: 'inherit',
  },
};
