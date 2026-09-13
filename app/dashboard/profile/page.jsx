'use client';

import { useEffect, useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.customer.profile.get();
        if (mounted) {
          const data = res.data || res;
          setProfile(data);
          setName(data.name || '');
          setPhone(data.phone || '');
        }
      } catch (e) {
        if (mounted) setFetchError(e.message || 'Failed to load profile.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditMsg('');
    setEditError('');
    try {
      const res = await api.customer.profile.update({ name, phone });
      setProfile((prev) => ({ ...prev, ...res.data || res }));
      setEditMsg('Profile updated successfully.');
    } catch (err) {
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPassLoading(true);
    setPassMsg('');
    setPassError('');
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      setPassLoading(false);
      return;
    }
    try {
      await api.customer.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPassMsg('Password changed successfully.');
    } catch (err) {
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setPassLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 md:px-8 py-14">
        <div className="h-10 w-56 animate-pulse rounded bg-shell" />
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white shadow-card" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-3xl px-6 md:px-8 py-14">
        <div className="rounded-3xl bg-white p-8 shadow-card text-center">
          <p className="text-rosewood-dark" role="alert">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-rosewood hover:underline">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow="My Profile" title="Account Details" description="Manage your personal information and password." />
      <div className="mx-auto max-w-3xl px-6 md:px-8 pb-20">
        <Reveal className="mt-10 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl text-espresso">Personal Information</h2>
            {editMsg && <p className="mt-3 text-sm text-emerald-700" role="status">{editMsg}</p>}
            {editError && <p className="mt-3 text-sm text-rosewood-dark" role="alert">{editError}</p>}
            <form onSubmit={handleProfileUpdate} className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Email</label>
                <input type="email" value={profile?.email || ''} disabled className="mt-1 w-full cursor-not-allowed rounded-xl border border-espresso/10 bg-espresso/5 px-4 py-3 text-espresso-soft" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Member Since</label>
                <p className="mt-1 text-sm text-espresso-soft">
                  {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
              <button type="submit" disabled={editLoading} className="rounded-full bg-espresso px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60">
                {editLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl text-espresso">Change Password</h2>
            {passMsg && <p className="mt-3 text-sm text-emerald-700" role="status">{passMsg}</p>}
            {passError && <p className="mt-3 text-sm text-rosewood-dark" role="alert">{passError}</p>}
            <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-espresso-soft">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-espresso/15 bg-white px-4 py-3 text-espresso focus:border-rosewood" />
              </div>
              <button type="submit" disabled={passLoading} className="rounded-full bg-espresso px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream transition hover:bg-rosewood-dark disabled:opacity-60">
                {passLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </>
  );
}
