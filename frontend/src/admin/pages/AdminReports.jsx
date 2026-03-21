import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios';

const TABS = { DONATIONS: 'donations', OVERVIEW: 'overview' };

function defaultDateRange() {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return 'ETB 0';
  return `ETB ${Number(n).toLocaleString()}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatGeneratedAt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  } catch { return iso; }
}

function formatChangePct(n) {
  if (n == null) return '—';
  const v = Number(n);
  return `${v > 0 ? '+' : ''}${v}%`;
}

function escapeCsvCell(val) {
  const s = String(val ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function FormalReportModal({ data, filters, churchInfo, onClose }) {
  if (!data) return null;

  const { summary, monthlyData, topDonors, donations } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const periodStr = `${formatDate(filters.startDate)} — ${formatDate(filters.endDate)}`;
  const typeLabel = filters.type === 'all' ? 'All Types' : filters.type === 'one-time' ? 'One-Time' : 'Monthly';
  const statusLabel = filters.status === 'all' ? 'All Statuses' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1);

  const handlePrint = () => {
    const printArea = document.getElementById('formal-report-content');
    if (!printArea) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`<!DOCTYPE html>
<html><head><title>Donation Report - ${churchInfo.churchName}</title>
<style>
  @page { margin: 16mm 14mm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; font-size: 11pt; line-height: 1.5; }
  .header { text-align: center; border-bottom: 2.5px solid #0ea5e9; padding-bottom: 14px; margin-bottom: 18px; }
  .header img { width: 56px; height: 56px; object-fit: contain; margin-bottom: 6px; }
  .header h1 { font-size: 18pt; font-weight: 800; color: #0f172a; margin: 0; }
  .header .sub { font-size: 10pt; color: #64748b; margin-top: 3px; }
  .header .contact { font-size: 9pt; color: #94a3b8; margin-top: 6px; }
  .report-title { font-size: 14pt; font-weight: 700; color: #0f172a; text-align: center; margin: 18px 0 4px; }
  .meta { text-align: center; font-size: 9.5pt; color: #64748b; margin-bottom: 18px; }
  .meta span { margin: 0 8px; }
  .section-title { font-size: 12pt; font-weight: 700; color: #0f172a; margin: 20px 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
  .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; text-align: center; }
  .summary-box .label { font-size: 8pt; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.04em; }
  .summary-box .value { font-size: 14pt; font-weight: 800; color: #0f172a; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-bottom: 14px; }
  th { background: #f1f5f9; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8pt; letter-spacing: 0.04em; padding: 8px 10px; text-align: left; border-bottom: 1.5px solid #cbd5e1; }
  td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
  tr:nth-child(even) { background: #f8fafc; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .font-bold { font-weight: 700; }
  .status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: 700; text-transform: uppercase; }
  .status-success { background: #dcfce7; color: #16a34a; }
  .status-pending { background: #fef3c7; color: #d97706; }
  .status-failed { background: #fee2e2; color: #dc2626; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1.5px solid #e2e8f0; text-align: center; font-size: 8.5pt; color: #94a3b8; }
  .footer .church-name { font-weight: 700; color: #64748b; }
  .watermark { position: fixed; bottom: 20mm; right: 14mm; font-size: 8pt; color: #cbd5e1; }
</style></head><body>${printArea.innerHTML}
<div class="watermark">Generated from Admin Portal</div>
</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.print(); }, 400);
  };

  return (
    <div style={rm.overlay}>
      <div style={rm.modal}>
        <div style={rm.topBar}>
          <span style={rm.topTitle}>Formal Donation Report</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={rm.printBtn} onClick={handlePrint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save as PDF
            </button>
            <button style={rm.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        <div style={rm.body} id="formal-report-content">
          {/* Letterhead */}
          <div className="header" style={rm.letterhead}>
            <img src="/logo.png" alt="" style={rm.logo} />
            <h1 style={rm.churchName}>{churchInfo.churchName}</h1>
            <div style={rm.churchSub}>{churchInfo.address?.replace(/\n/g, ' | ')}</div>
            <div style={rm.churchContact}>
              {churchInfo.phone && <span>{churchInfo.phone}</span>}
              {churchInfo.phone && churchInfo.email && <span style={{ margin: '0 8px' }}>|</span>}
              {churchInfo.email && <span>{churchInfo.email}</span>}
            </div>
          </div>

          <div className="report-title" style={rm.reportTitle}>Donation Report</div>
          <div className="meta" style={rm.meta}>
            <span>Period: {periodStr}</span>
            <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span>
            <span>Type: {typeLabel}</span>
            <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span>
            <span>Status: {statusLabel}</span>
            <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span>
            <span>Generated: {dateStr} at {timeStr}</span>
          </div>

          {/* Summary */}
          <div className="section-title" style={rm.sectionTitle}>Summary</div>
          <div className="summary-grid" style={rm.summaryGrid}>
            <div className="summary-box" style={rm.summaryBox}>
              <div className="label" style={rm.summaryLabel}>Total Amount</div>
              <div className="value" style={rm.summaryValue}>{formatMoney(summary?.total)}</div>
            </div>
            <div className="summary-box" style={rm.summaryBox}>
              <div className="label" style={rm.summaryLabel}>Total Count</div>
              <div className="value" style={rm.summaryValue}>{summary?.count ?? 0}</div>
            </div>
            <div className="summary-box" style={rm.summaryBox}>
              <div className="label" style={rm.summaryLabel}>Average</div>
              <div className="value" style={rm.summaryValue}>{formatMoney(summary?.average)}</div>
            </div>
            <div className="summary-box" style={rm.summaryBox}>
              <div className="label" style={rm.summaryLabel}>Highest</div>
              <div className="value" style={rm.summaryValue}>{formatMoney(summary?.max)}</div>
            </div>
          </div>

          {/* Top Donors */}
          {topDonors?.length > 0 && (
            <>
              <div className="section-title" style={rm.sectionTitle}>Top Donors</div>
              <table>
                <thead>
                  <tr>
                    <th style={rm.th}>Rank</th>
                    <th style={rm.th}>Donor Name</th>
                    <th style={rm.th}>Email</th>
                    <th style={{ ...rm.th, textAlign: 'right' }}>Total Donated</th>
                    <th style={{ ...rm.th, textAlign: 'center' }}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topDonors.map((d, i) => (
                    <tr key={d._id || i}>
                      <td style={rm.td}>{i + 1}</td>
                      <td style={{ ...rm.td, fontWeight: 600 }}>{d.name || '—'}</td>
                      <td style={rm.td}>{d._id}</td>
                      <td style={{ ...rm.td, textAlign: 'right', fontWeight: 700 }}>{formatMoney(d.total)}</td>
                      <td style={{ ...rm.td, textAlign: 'center' }}>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Monthly Breakdown */}
          {monthlyData?.length > 0 && (
            <>
              <div className="section-title" style={rm.sectionTitle}>Monthly Breakdown</div>
              <table>
                <thead>
                  <tr>
                    <th style={rm.th}>Month</th>
                    <th style={{ ...rm.th, textAlign: 'right' }}>Total Amount</th>
                    <th style={{ ...rm.th, textAlign: 'center' }}>Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((m, i) => (
                    <tr key={i}>
                      <td style={{ ...rm.td, fontWeight: 600 }}>{m.month}</td>
                      <td style={{ ...rm.td, textAlign: 'right', fontWeight: 700 }}>{formatMoney(m.total)}</td>
                      <td style={{ ...rm.td, textAlign: 'center' }}>{m.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* All Donations */}
          <div className="section-title" style={rm.sectionTitle}>Transaction Details ({donations?.length || 0} records)</div>
          {donations?.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th style={rm.th}>#</th>
                  <th style={rm.th}>Date</th>
                  <th style={rm.th}>Donor</th>
                  <th style={rm.th}>Email</th>
                  <th style={{ ...rm.th, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...rm.th, textAlign: 'center' }}>Type</th>
                  <th style={{ ...rm.th, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d._id || i}>
                    <td style={rm.td}>{i + 1}</td>
                    <td style={rm.td}>{new Date(d.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td style={{ ...rm.td, fontWeight: 600 }}>{d.firstName} {d.lastName}</td>
                    <td style={rm.td}>{d.email}</td>
                    <td style={{ ...rm.td, textAlign: 'right', fontWeight: 700 }}>{formatMoney(d.amount)}</td>
                    <td style={{ ...rm.td, textAlign: 'center', textTransform: 'capitalize' }}>{d.donationType}</td>
                    <td style={{ ...rm.td, textAlign: 'center' }}>
                      <span className={`status status-${d.status}`} style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                        background: d.status === 'success' ? '#dcfce7' : d.status === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: d.status === 'success' ? '#16a34a' : d.status === 'pending' ? '#d97706' : '#dc2626',
                      }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '12px 0' }}>No donation records for this period.</p>
          )}

          {/* Footer */}
          <div className="footer" style={rm.footer}>
            <div className="church-name" style={{ fontWeight: 700, color: '#64748b', marginBottom: 2 }}>{churchInfo.churchName}</div>
            <div>This report was generated from the Church Admin Portal on {dateStr} at {timeStr}.</div>
            <div style={{ marginTop: 3 }}>This document is for internal use only. All amounts are in Ethiopian Birr (ETB).</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewReportModal({ data, churchInfo, onClose }) {
  if (!data) return null;

  const { thisMonth, allTime, generatedAt } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrint = () => {
    const printArea = document.getElementById('overview-report-content');
    if (!printArea) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`<!DOCTYPE html>
<html><head><title>Monthly Overview - ${churchInfo.churchName}</title>
<style>
  @page { margin: 16mm 14mm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; font-size: 11pt; line-height: 1.5; }
  .header { text-align: center; border-bottom: 2.5px solid #0ea5e9; padding-bottom: 14px; margin-bottom: 18px; }
  .header img { width: 56px; height: 56px; object-fit: contain; margin-bottom: 6px; }
  .header h1 { font-size: 18pt; font-weight: 800; color: #0f172a; }
  .header .sub { font-size: 10pt; color: #64748b; margin-top: 3px; }
  .header .contact { font-size: 9pt; color: #94a3b8; margin-top: 6px; }
  .report-title { font-size: 14pt; font-weight: 700; color: #0f172a; text-align: center; margin: 16px 0 4px; }
  .meta { text-align: center; font-size: 9.5pt; color: #64748b; margin-bottom: 18px; }
  .section-title { font-size: 12pt; font-weight: 700; color: #0f172a; margin: 18px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; }
  .card .label { font-size: 8pt; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.04em; }
  .card .value { font-size: 16pt; font-weight: 800; color: #0f172a; margin: 4px 0 2px; }
  .card .detail { font-size: 9pt; color: #94a3b8; }
  .card .change { font-size: 9pt; font-weight: 600; color: #0ea5e9; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1.5px solid #e2e8f0; text-align: center; font-size: 8.5pt; color: #94a3b8; }
  .footer .church-name { font-weight: 700; color: #64748b; }
</style></head><body>${printArea.innerHTML}</body></html>`);
    printWin.document.close();
    setTimeout(() => { printWin.print(); }, 400);
  };

  return (
    <div style={rm.overlay}>
      <div style={rm.modal}>
        <div style={rm.topBar}>
          <span style={rm.topTitle}>Monthly Overview Report</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={rm.printBtn} onClick={handlePrint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save as PDF
            </button>
            <button style={rm.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        <div style={rm.body} id="overview-report-content">
          <div className="header" style={rm.letterhead}>
            <img src="/logo.png" alt="" style={rm.logo} />
            <h1 style={rm.churchName}>{churchInfo.churchName}</h1>
            <div className="sub" style={rm.churchSub}>{churchInfo.address?.replace(/\n/g, ' | ')}</div>
            <div className="contact" style={rm.churchContact}>
              {churchInfo.phone && <span>{churchInfo.phone}</span>}
              {churchInfo.phone && churchInfo.email && <span style={{ margin: '0 8px' }}>|</span>}
              {churchInfo.email && <span>{churchInfo.email}</span>}
            </div>
          </div>

          <div className="report-title" style={rm.reportTitle}>Monthly Overview Report</div>
          <div className="meta" style={rm.meta}>
            <span>Month: {monthName}</span>
            <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span>
            <span>Generated: {dateStr} at {timeStr}</span>
          </div>

          <div className="section-title" style={rm.sectionTitle}>This Month&apos;s Activity</div>
          <div className="grid" style={rm.overviewGrid}>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Donations</div>
              <div className="value" style={rm.overviewValue}>{thisMonth?.donations?.count ?? 0}</div>
              <div className="detail" style={rm.overviewDetail}>{formatMoney(thisMonth?.donations?.amount)} collected</div>
              <div className="change" style={rm.overviewChange}>{formatChangePct(thisMonth?.donations?.change)} vs last month</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Upcoming Events</div>
              <div className="value" style={rm.overviewValue}>{thisMonth?.events?.upcoming ?? 0}</div>
              <div className="detail" style={rm.overviewDetail}>Scheduled</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>New Sermons</div>
              <div className="value" style={rm.overviewValue}>{thisMonth?.sermons?.count ?? 0}</div>
              <div className="detail" style={rm.overviewDetail}>Published this month</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Contact Messages</div>
              <div className="value" style={rm.overviewValue}>{thisMonth?.contacts?.count ?? 0}</div>
              <div className="change" style={rm.overviewChange}>{formatChangePct(thisMonth?.contacts?.change)} vs last month</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Event Registrations</div>
              <div className="value" style={rm.overviewValue}>{thisMonth?.registrations?.count ?? 0}</div>
              <div className="detail" style={rm.overviewDetail}>This month</div>
            </div>
          </div>

          <div className="section-title" style={rm.sectionTitle}>All-Time Statistics</div>
          <div className="grid" style={rm.overviewGrid}>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Total Donations</div>
              <div className="value" style={rm.overviewValue}>{formatMoney(allTime?.donations)}</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Total Events</div>
              <div className="value" style={rm.overviewValue}>{allTime?.events ?? 0}</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Total Sermons</div>
              <div className="value" style={rm.overviewValue}>{allTime?.sermons ?? 0}</div>
            </div>
            <div className="card" style={rm.overviewBox}>
              <div className="label" style={rm.overviewLabel}>Total Contacts</div>
              <div className="value" style={rm.overviewValue}>{allTime?.contacts ?? 0}</div>
            </div>
          </div>

          <div className="footer" style={rm.footer}>
            <div className="church-name" style={{ fontWeight: 700, color: '#64748b', marginBottom: 2 }}>{churchInfo.churchName}</div>
            <div>This report was generated from the Church Admin Portal on {dateStr} at {timeStr}.</div>
            <div style={{ marginTop: 3 }}>This document is for internal use only. All amounts are in Ethiopian Birr (ETB).</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState(TABS.DONATIONS);
  const [{ startDate, endDate }, setRange] = useState(defaultDateRange);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState(null);
  const [donationPayload, setDonationPayload] = useState(null);

  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);
  const [overviewPayload, setOverviewPayload] = useState(null);
  const [overviewFetched, setOverviewFetched] = useState(false);

  const [churchInfo, setChurchInfo] = useState({
    churchName: 'Kerabu Full Gospel Believers Church',
    address: 'Addis Ababa, Ethiopia',
    phone: '',
    email: '',
  });

  const [showDonationReport, setShowDonationReport] = useState(false);
  const [showOverviewReport, setShowOverviewReport] = useState(false);

  useEffect(() => {
    api.get('/site-content').then(res => {
      if (res.data) {
        setChurchInfo({
          churchName: res.data.churchName || 'Kerabu Full Gospel Believers Church',
          address: res.data.address || 'Addis Ababa, Ethiopia',
          phone: res.data.phone || '',
          email: res.data.email || '',
        });
      }
    }).catch(() => {});
  }, []);

  const fetchDonationReport = useCallback(async () => {
    setDonationLoading(true);
    setDonationError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      const q = params.toString();
      const { data } = await api.get(`/reports/donations${q ? `?${q}` : ''}`);
      setDonationPayload(data);
    } catch (e) {
      setDonationError(e.response?.data?.message || e.message || 'Failed to load report');
      setDonationPayload(null);
    } finally {
      setDonationLoading(false);
    }
  }, [startDate, endDate, typeFilter, statusFilter]);

  useEffect(() => { fetchDonationReport(); }, []);

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const { data } = await api.get('/reports/overview');
      setOverviewPayload(data);
      setOverviewFetched(true);
    } catch (e) {
      setOverviewError(e.response?.data?.message || e.message || 'Failed to load overview');
      setOverviewPayload(null);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === TABS.OVERVIEW && !overviewFetched && !overviewLoading) fetchOverview();
  }, [activeTab, overviewFetched, overviewLoading, fetchOverview]);

  const handleGenerateReport = async () => {
    await fetchDonationReport();
    setShowDonationReport(true);
  };

  const handleGenerateOverview = async () => {
    if (!overviewPayload) await fetchOverview();
    setShowOverviewReport(true);
  };

  const exportDonationsCsv = () => {
    const rows = donationPayload?.donations || [];
    const headers = ['Date', 'Donor', 'Email', 'Amount', 'Type', 'Status'];
    const lines = [
      headers.join(','),
      ...rows.map((d) =>
        [
          escapeCsvCell(new Date(d.createdAt).toLocaleDateString('en-US')),
          escapeCsvCell(`${d.firstName || ''} ${d.lastName || ''}`.trim()),
          escapeCsvCell(d.email),
          escapeCsvCell(d.amount),
          escapeCsvCell(d.donationType),
          escapeCsvCell(d.status),
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = donationPayload?.summary;
  const monthlyData = donationPayload?.monthlyData?.length ? donationPayload.monthlyData : [{ month: '—', total: 0, count: 0 }];
  const topDonors = donationPayload?.topDonors || [];
  const donationsList = donationPayload?.donations || [];
  const tm = overviewPayload?.thisMonth;
  const at = overviewPayload?.allTime;

  return (
    <div style={st.page}>
      <style>{`
        @keyframes admin-reports-spin { to { transform: rotate(360deg); } }
      `}</style>

      {showDonationReport && (
        <FormalReportModal
          data={donationPayload}
          filters={{ startDate, endDate, type: typeFilter, status: statusFilter }}
          churchInfo={churchInfo}
          onClose={() => setShowDonationReport(false)}
        />
      )}
      {showOverviewReport && (
        <OverviewReportModal
          data={overviewPayload}
          churchInfo={churchInfo}
          onClose={() => setShowOverviewReport(false)}
        />
      )}

      <div>
        <div style={st.headerRow}>
          <div>
            <h1 style={st.title}>Reports &amp; Analytics</h1>
            <p style={st.subtitle}>Donation insights and church-wide summary</p>
          </div>
        </div>

        <div style={st.tabRow}>
          <div style={st.tabsWrap}>
            <button type="button" onClick={() => setActiveTab(TABS.DONATIONS)}
              style={{ ...st.tabBtn, ...(activeTab === TABS.DONATIONS ? st.tabBtnActive : {}) }}>
              Donation Reports
            </button>
            <button type="button" onClick={() => setActiveTab(TABS.OVERVIEW)}
              style={{ ...st.tabBtn, ...(activeTab === TABS.OVERVIEW ? st.tabBtnActive : {}) }}>
              Overview Summary
            </button>
          </div>
        </div>

        {activeTab === TABS.DONATIONS && (
          <div>
            <div style={st.card}>
              <div style={st.filterGrid}>
                <div style={st.field}>
                  <label style={st.label}>Start date</label>
                  <input type="date" value={startDate} onChange={(e) => setRange((r) => ({ ...r, startDate: e.target.value }))} style={st.input} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>End date</label>
                  <input type="date" value={endDate} onChange={(e) => setRange((r) => ({ ...r, endDate: e.target.value }))} style={st.input} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Donation type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={st.select}>
                    <option value="all">All</option>
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div style={st.field}>
                  <label style={st.label}>Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={st.select}>
                    <option value="all">All</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div style={{ ...st.field, justifyContent: 'flex-end', alignSelf: 'end' }}>
                  <button type="button" style={{ ...st.generateBtn, ...(donationLoading ? st.primaryBtnDisabled : {}) }}
                    onClick={handleGenerateReport} disabled={donationLoading}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    {donationLoading ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </div>

            {donationLoading && !donationPayload && (
              <div style={{ ...st.card, ...st.loadingBox }}>
                <div style={st.spinner} aria-hidden />
                <p style={st.loadingText}>Loading...</p>
              </div>
            )}

            {donationError && <div style={{ ...st.card, ...st.errorBox }}>{donationError}</div>}

            {donationLoading && donationPayload && (
              <p style={st.updatingHint}>Updating report...</p>
            )}

            {donationPayload && (
              <>
                <div style={st.summaryGrid}>
                  <div style={st.summaryCard}>
                    <p style={st.summaryLabel}>Total Amount</p>
                    <p style={st.summaryValue}>{formatMoney(summary?.total)}</p>
                  </div>
                  <div style={st.summaryCard}>
                    <p style={st.summaryLabel}>Total Count</p>
                    <p style={st.summaryValue}>{summary?.count ?? 0}</p>
                  </div>
                  <div style={st.summaryCard}>
                    <p style={st.summaryLabel}>Average Donation</p>
                    <p style={st.summaryValue}>{formatMoney(summary?.average)}</p>
                  </div>
                  <div style={st.summaryCard}>
                    <p style={st.summaryLabel}>Top Donation</p>
                    <p style={st.summaryValue}>{formatMoney(summary?.max)}</p>
                  </div>
                </div>

                <div style={st.card}>
                  <h2 style={st.sectionTitle}>Monthly donations</h2>
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          formatter={(value, name) => name === 'total' ? [formatMoney(value), 'Total'] : [value, 'Count']}
                        />
                        <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={st.card}>
                  <h2 style={st.sectionTitle}>Top donors</h2>
                  {topDonors.length === 0 ? (
                    <p style={st.muted}>No donors in this range.</p>
                  ) : (
                    <div style={st.tableWrap}>
                      <table style={st.table}>
                        <thead>
                          <tr>
                            <th style={st.th}>Rank</th>
                            <th style={st.th}>Name</th>
                            <th style={st.th}>Email</th>
                            <th style={st.th}>Total</th>
                            <th style={st.th}>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topDonors.map((row, i) => (
                            <tr key={row._id || i} style={{ ...st.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                              <td style={st.td}>{i + 1}</td>
                              <td style={{ ...st.td, fontWeight: 600, color: '#0f172a' }}>{row.name || '—'}</td>
                              <td style={{ ...st.td, color: '#64748b', fontSize: 13 }}>{row._id}</td>
                              <td style={{ ...st.td, fontWeight: 700 }}>{formatMoney(row.total)}</td>
                              <td style={st.td}>{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div style={st.card}>
                  <div style={st.tableHeaderRow}>
                    <h2 style={{ ...st.sectionTitle, marginBottom: 0 }}>All donations</h2>
                    <button type="button" style={st.exportBtn} onClick={exportDonationsCsv}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export CSV
                    </button>
                  </div>
                  {donationsList.length === 0 ? (
                    <p style={st.muted}>No rows for the selected filters.</p>
                  ) : (
                    <div style={st.tableWrap}>
                      <table style={st.table}>
                        <thead>
                          <tr>
                            <th style={st.th}>Date</th>
                            <th style={st.th}>Donor</th>
                            <th style={st.th}>Email</th>
                            <th style={st.th}>Amount</th>
                            <th style={st.th}>Type</th>
                            <th style={st.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationsList.map((d, i) => (
                            <tr key={d._id || i} style={{ ...st.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                              <td style={{ ...st.td, color: '#64748b', fontSize: 13 }}>
                                {new Date(d.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td style={{ ...st.td, fontWeight: 600, color: '#0f172a' }}>{d.firstName} {d.lastName}</td>
                              <td style={{ ...st.td, color: '#64748b', fontSize: 13 }}>{d.email}</td>
                              <td style={{ ...st.td, fontWeight: 700 }}>{formatMoney(d.amount)}</td>
                              <td style={{ ...st.td, textTransform: 'capitalize' }}>{d.donationType}</td>
                              <td style={st.td}>
                                <span style={{ ...st.statusPill, ...(st.statusTone[d.status] || st.statusTone.default) }}>{d.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === TABS.OVERVIEW && (
          <div>
            <div style={st.overviewTopRow}>
              <p style={st.generatedLine}>
                Report generated on{' '}
                <strong style={{ color: '#0f172a' }}>{formatGeneratedAt(overviewPayload?.generatedAt)}</strong>
              </p>
              <button type="button" style={st.generateBtn} onClick={handleGenerateOverview} disabled={overviewLoading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                {overviewLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>

            {overviewLoading && !overviewPayload && (
              <div style={{ ...st.card, ...st.loadingBox }}>
                <div style={st.spinner} aria-hidden />
                <p style={st.loadingText}>Loading...</p>
              </div>
            )}

            {overviewError && <div style={{ ...st.card, ...st.errorBox }}>{overviewError}</div>}

            {overviewPayload && (
              <>
                <h2 style={st.sectionHeading}>This month</h2>
                <div style={st.overviewGrid}>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Donations</p>
                    <p style={st.overviewCardValue}>{tm?.donations?.count ?? 0}</p>
                    <p style={st.overviewCardSub}>{formatMoney(tm?.donations?.amount)}</p>
                    <p style={st.overviewChange}>{formatChangePct(tm?.donations?.change)} vs last month</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Events</p>
                    <p style={st.overviewCardValue}>{tm?.events?.upcoming ?? 0}</p>
                    <p style={st.overviewCardSub}>Upcoming</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Sermons</p>
                    <p style={st.overviewCardValue}>{tm?.sermons?.count ?? 0}</p>
                    <p style={st.overviewCardSub}>New this month</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Contacts</p>
                    <p style={st.overviewCardValue}>{tm?.contacts?.count ?? 0}</p>
                    <p style={st.overviewChange}>{formatChangePct(tm?.contacts?.change)} vs last month</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Registrations</p>
                    <p style={st.overviewCardValue}>{tm?.registrations?.count ?? 0}</p>
                    <p style={st.overviewCardSub}>This month</p>
                  </div>
                </div>

                <h2 style={st.sectionHeading}>All-time</h2>
                <div style={st.overviewGrid}>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Total donations</p>
                    <p style={st.overviewCardValue}>{formatMoney(at?.donations)}</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Total events</p>
                    <p style={st.overviewCardValue}>{at?.events ?? 0}</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Total sermons</p>
                    <p style={st.overviewCardValue}>{at?.sermons ?? 0}</p>
                  </div>
                  <div style={st.overviewCard}>
                    <p style={st.overviewCardLabel}>Total contacts</p>
                    <p style={st.overviewCardValue}>{at?.contacts ?? 0}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const rm = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
    zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '30px 20px', overflowY: 'auto',
  },
  modal: {
    background: '#fff', borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: 900,
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px', borderBottom: '1px solid #e2e8f0', flexShrink: 0,
  },
  topTitle: { fontSize: 16, fontWeight: 700, color: '#0f172a' },
  printBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '8px 16px', borderRadius: 8,
    border: '1.5px solid #0ea5e9', background: '#f0f9ff',
    color: '#0ea5e9', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 8,
    border: '1px solid #e2e8f0', background: '#f8fafc',
    fontSize: 20, color: '#64748b', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'inherit',
  },
  body: {
    padding: '28px 32px', overflowY: 'auto', flex: 1,
    fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
    color: '#1e293b', fontSize: 14, lineHeight: 1.5,
  },
  letterhead: {
    textAlign: 'center', borderBottom: '2.5px solid #0ea5e9',
    paddingBottom: 14, marginBottom: 18,
  },
  logo: { width: 60, height: 60, objectFit: 'contain', marginBottom: 6 },
  churchName: { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 },
  churchSub: { fontSize: 13, color: '#64748b', marginTop: 3 },
  churchContact: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
  reportTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', textAlign: 'center', margin: '16px 0 4px' },
  meta: { textAlign: 'center', fontSize: 12, color: '#64748b', marginBottom: 18 },
  sectionTitle: {
    fontSize: 15, fontWeight: 700, color: '#0f172a',
    margin: '20px 0 8px', borderBottom: '1px solid #e2e8f0', paddingBottom: 4,
  },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10, marginBottom: 16,
  },
  summaryBox: {
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: 6, padding: '10px 12px', textAlign: 'center',
  },
  summaryLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', margin: 0 },
  summaryValue: { fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 2, marginBottom: 0 },
  th: {
    padding: '8px 10px', fontSize: 10, fontWeight: 700,
    color: '#475569', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1',
    textTransform: 'uppercase', letterSpacing: '0.04em', background: '#f1f5f9',
  },
  td: { padding: '7px 10px', fontSize: 13, borderBottom: '1px solid #f1f5f9' },
  footer: {
    marginTop: 28, paddingTop: 12,
    borderTop: '1.5px solid #e2e8f0', textAlign: 'center',
    fontSize: 11, color: '#94a3b8',
  },
  overviewGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10, marginBottom: 14,
  },
  overviewBox: {
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: 6, padding: '14px 16px',
  },
  overviewLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', margin: 0 },
  overviewValue: { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' },
  overviewDetail: { fontSize: 11, color: '#94a3b8', margin: 0 },
  overviewChange: { fontSize: 11, fontWeight: 600, color: '#0ea5e9', margin: 0 },
};

const st = {
  page: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#334155',
  },
  headerRow: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  tabRow: { marginBottom: 20 },
  tabsWrap: {
    display: 'inline-flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4,
  },
  tabBtn: {
    padding: '9px 20px', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    background: 'transparent', color: '#64748b', fontFamily: 'inherit',
  },
  tabBtnActive: {
    background: '#fff', color: '#0ea5e9', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  card: {
    background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 22px', marginBottom: 20,
  },
  filterGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16, alignItems: 'end',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#64748b' },
  input: {
    padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
    fontSize: 14, color: '#0f172a', fontFamily: 'inherit', background: '#fff',
  },
  select: {
    padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
    fontSize: 14, color: '#0f172a', fontFamily: 'inherit', background: '#fff', cursor: 'pointer',
  },
  generateBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: '#0ea5e9', color: '#fff', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 2px rgba(14,165,233,0.35)',
  },
  primaryBtnDisabled: { opacity: 0.75, cursor: 'not-allowed' },
  updatingHint: { margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#0ea5e9' },
  loadingBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 12, padding: '48px 24px',
  },
  spinner: {
    width: 36, height: 36, borderRadius: '50%',
    border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9',
    animation: 'admin-reports-spin 0.8s linear infinite',
  },
  loadingText: { margin: 0, fontSize: 15, color: '#64748b', fontWeight: 600 },
  errorBox: { color: '#dc2626', fontWeight: 600, fontSize: 14, padding: '20px 22px' },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16, marginBottom: 20,
  },
  summaryCard: {
    background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '18px 20px',
  },
  summaryLabel: { fontSize: 12, color: '#64748b', margin: '0 0 6px', fontWeight: 600 },
  summaryValue: { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' },
  sectionHeading: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' },
  muted: { margin: 0, color: '#94a3b8', fontSize: 14 },
  tableWrap: { overflowX: 'auto', margin: '0 -6px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 520 },
  th: {
    padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b',
    textAlign: 'left', borderBottom: '1px solid #f1f5f9',
    textTransform: 'uppercase', letterSpacing: '0.04em', background: '#f8fafc',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: 14, verticalAlign: 'middle' },
  statusPill: {
    display: 'inline-block', padding: '3px 10px', borderRadius: 6,
    fontSize: 12, fontWeight: 700, textTransform: 'capitalize', border: '1px solid',
  },
  statusTone: {
    success: { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' },
    pending: { background: '#fffbeb', color: '#d97706', borderColor: '#fde68a' },
    failed: { background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' },
    default: { background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' },
  },
  tableHeaderRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, flexWrap: 'wrap', marginBottom: 16,
  },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 18px', background: '#f0f9ff', color: '#0ea5e9',
    border: '1.5px solid #bae6fd', borderRadius: 10,
    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  overviewTopRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, marginBottom: 20, flexWrap: 'wrap',
  },
  generatedLine: { margin: 0, fontSize: 14, color: '#64748b' },
  overviewGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16, marginBottom: 28,
  },
  overviewCard: {
    background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '18px 20px',
  },
  overviewCardLabel: {
    fontSize: 12, fontWeight: 600, color: '#64748b', margin: '0 0 8px',
    textTransform: 'uppercase', letterSpacing: '0.03em',
  },
  overviewCardValue: { fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
  overviewCardSub: { fontSize: 13, color: '#94a3b8', margin: 0 },
  overviewChange: { fontSize: 13, color: '#0ea5e9', fontWeight: 600, margin: '8px 0 0' },
};
