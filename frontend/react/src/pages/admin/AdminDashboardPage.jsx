import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { registrationService } from '../../services/registrationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { Users, Calendar, Ticket, ArrowRight, ShieldCheck, Plus, List } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, regsData] = await Promise.all([
        dashboardService.getStats(),
        registrationService.getAllRegistrations(),
      ]);
      setStats(statsData || { totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
      setRecentRegistrations(regsData ? regsData.slice(-8).reverse() : []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-warning">Admin Console</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>Platform Overview</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/events" className="btn btn-secondary btn-sm">
            <Calendar size={16} />
            Manage Events
          </Link>
          <Link to="/admin/categories" className="btn btn-secondary btn-sm">
            <List size={16} />
            Manage Categories
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching platform analytics..." />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-3 mb-8">
            <div className="card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={28} />
              </div>
              <div>
                <div className="text-muted text-sm font-semibold uppercase tracking-wider">Total Users</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.1' }}>
                  {stats.totalUsers}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={28} />
              </div>
              <div>
                <div className="text-muted text-sm font-semibold uppercase tracking-wider">Total Events</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.1' }}>
                  {stats.totalEvents}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ticket size={28} />
              </div>
              <div>
                <div className="text-muted text-sm font-semibold uppercase tracking-wider">Registrations</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.1' }}>
                  {stats.totalRegistrations}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="card mb-8">
            <div
              style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Recent Registrations</h3>
                <p className="text-muted text-sm">Real-time feed of latest ticket bookings across all events</p>
              </div>
              <Link to="/admin/events" className="btn btn-ghost btn-sm">
                View All Events <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Event</th>
                    <th>Date Booked</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted" style={{ padding: '3rem' }}>
                        No registrations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentRegistrations.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="font-semibold">{r.userName || 'Attendee'}</div>
                          <div className="text-muted text-sm">{r.userEmail}</div>
                        </td>
                        <td>
                          <div className="font-semibold">{r.eventTitle}</div>
                        </td>
                        <td>{formatDate(r.registrationDate)}</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
