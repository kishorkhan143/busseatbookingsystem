import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Settings,
  HeartHandshake,
  Armchair,
  Leaf,
  RotateCcw,
  CheckCircle2,
  Edit3,
  X,
  Save,
} from 'lucide-react';
import { UserProfile } from '../services/api';
import { NavTab } from './TopMenuBar';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (tab: NavTab) => void;
  onResetAllData: () => void;
  totalBookingsCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onResetAllData,
  totalBookingsCount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editForm);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <span>Traveler Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details, travel preferences, and loyalty rewards.
        </p>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl backdrop-blur-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Liquid Glass Traveler ID Card */}
      <section className="relative overflow-hidden backdrop-blur-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.5)] space-y-6">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 to-blue-400">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white" title="Verified Traveler">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-extrabold uppercase">
                  {profile.memberTier}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+91 {profile.mobile}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => {
              setEditForm(profile);
              setIsEditing(true);
            }}
            className="self-start sm:self-auto px-4 py-2 rounded-xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 hover:scale-105"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Travel Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.08]">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Bookings</span>
            <span className="text-xl font-black text-white block mt-0.5">{totalBookingsCount}</span>
            <span className="text-[10px] text-emerald-400">Current session</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Loyalty Points</span>
            <span className="text-xl font-black text-cyan-300 block mt-0.5">{profile.loyaltyPoints}</span>
            <span className="text-[10px] text-slate-400">₹450 credit value</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Preferred Seat</span>
            <span className="text-xl font-black text-white block mt-0.5">{profile.preferredSeatType}</span>
            <span className="text-[10px] text-slate-400">Pre-selection filter</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CO₂ Saved</span>
            <span className="text-xl font-black text-emerald-400 block mt-0.5">{profile.carbonOffsetKg} kg</span>
            <span className="text-[10px] text-slate-400">By choosing bus transit</span>
          </div>
        </div>
      </section>

      {/* Preferences & Settings */}
      <section className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Travel Preferences &amp; Safety</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Emergency Contact</span>
            <p className="font-bold text-white text-sm">{profile.emergencyContact}</p>
            <p className="text-slate-400 text-[11px]">Automatically notified during journey updates</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/[0.06] space-y-2">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Seat Preference</span>
            <p className="font-bold text-cyan-300 text-sm">{profile.preferredSeatType} Seat</p>
            <p className="text-slate-400 text-[11px]">Default layout priority</p>
          </div>
        </div>
      </section>

      {/* Quick Navigation & Demo Actions */}
      <section className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Quick Actions</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('ticket-booking')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Book New Seats</span>
          </button>

          <button
            onClick={() => onNavigate('my-bookings')}
            className="px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span>View My Bookings</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] space-y-4 animate-scale-in">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Edit Traveler Profile</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Mobile (10 Digits)</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Seat Preference</label>
                <select
                  value={editForm.preferredSeatType}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      preferredSeatType: e.target.value as 'Window' | 'Aisle' | 'Any',
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="Any">Any Seat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_12px_45px_0_rgba(0,0,0,0.6)] space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset All Demo Data?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will clear all created bookings and reset all 30 seats back to <strong className="text-emerald-400">AVAILABLE</strong>.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
