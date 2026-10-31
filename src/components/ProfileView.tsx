import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Armchair,
  RotateCcw,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Shield,
} from 'lucide-react';
import { UserProfile } from '../services/api';
import { NavTab } from './TopMenuBar';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (tab: NavTab) => void;
  onResetAllData: () => void;
  totalBookingsCount?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onResetAllData,
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
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-3.5 sm:gap-4 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl liquid-glass-card">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(6,182,212,0.35)] border border-white/40">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</h1>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">{profile.memberTier} Member</span>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setEditForm(profile);
              setIsEditing(true);
            }}
            className="px-3 py-1 rounded-xl liquid-glass-btn-secondary text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Edit3 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 animate-scale-in backdrop-blur-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profile saved successfully.</span>
        </div>
      )}

      {/* Main Profile Info: INLINE Edit or Display (NO OVERLAY) */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="p-3.5 sm:p-5 rounded-3xl liquid-glass-card flex flex-col gap-3 text-xs"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50 dark:border-white/5">
            <span className="font-bold text-slate-900 dark:text-white">Edit Profile Details</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Mobile</label>
              <input
                type="tel"
                maxLength={10}
                required
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value.replace(/\D/g, '') })}
                className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Seat Preference</label>
              <select
                value={editForm.preferredSeatType}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    preferredSeatType: e.target.value as 'Window' | 'Aisle' | 'Any',
                  })
                }
                className="w-full p-2 liquid-glass-input rounded-xl text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
              >
                <option value="Window" className="bg-white dark:bg-slate-900">Window</option>
                <option value="Aisle" className="bg-white dark:bg-slate-900">Aisle</option>
                <option value="Any" className="bg-white dark:bg-slate-900">Any</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl liquid-glass-btn-secondary text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass-card flex flex-col gap-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass">
              <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Email</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">{profile.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass">
              <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">+91 {profile.mobile}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass">
              <Armchair className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Preference</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-300">{profile.preferredSeatType} Seat</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass">
              <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">Emergency</span>
                <span className="font-bold text-slate-900 dark:text-white">{profile.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Inline Reset (NO OVERLAY) */}
      <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass-card flex flex-col gap-2.5">
        <span className="text-xs font-bold text-slate-900 dark:text-white">Quick Actions</span>

        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('ticket-booking')}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-primary text-white font-bold cursor-pointer active:scale-95"
            >
              Book Ticket
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-btn-secondary text-slate-800 dark:text-slate-200 font-bold cursor-pointer active:scale-95"
            >
              My Bookings
            </button>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1 cursor-pointer active:scale-95 ml-auto backdrop-blur-md"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 ml-auto backdrop-blur-md">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">Reset all demo data?</span>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer active:scale-95"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
