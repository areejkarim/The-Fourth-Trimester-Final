
import React, { useState } from 'react';
import { User, Baby, HeartPulse, FileText, Save } from 'lucide-react';
import { UserProfile, BirthType } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const birthTypes: BirthType[] = ['Vaginal', 'C-Section', 'Vaginal with Intervention', 'Other'];

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black">My Health Profile</h1>
        <p className="text-black opacity-60 font-medium">Keep your information up to date to get accurate AI insights.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <User size={20} className="text-pink-500" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 transition-all text-black font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full p-3 bg-gray-100 rounded-xl border-none text-black opacity-40 cursor-not-allowed font-bold"
                />
              </div>
            </div>
          </section>

          {/* Family Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <Baby size={20} className="text-pink-500" /> Family & Birth
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1">Number of Kids</label>
                <input 
                  type="number" 
                  value={formData.kids}
                  onChange={(e) => setFormData({ ...formData, kids: parseInt(e.target.value) })}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 transition-all text-black font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1">Kids' Ages / Due Date</label>
                <input 
                  type="text" 
                  value={formData.kidsAges}
                  onChange={(e) => setFormData({ ...formData, kidsAges: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 transition-all text-black font-bold"
                  placeholder="e.g. 2 months, 3 years"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1">Birth Type (Latest)</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {birthTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, birthType: type })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        formData.birthType === type 
                          ? 'bg-black text-white shadow-md' 
                          : 'bg-gray-100 text-black opacity-60 hover:opacity-100 hover:bg-pink-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Medical Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <HeartPulse size={20} className="text-pink-500" /> Health & Medical
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1 flex items-center gap-1">
                  <FileText size={12} /> Diagnoses / Conditions
                </label>
                <input 
                  type="text" 
                  value={formData.diagnoses}
                  onChange={(e) => setFormData({ ...formData, diagnoses: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 transition-all text-black font-bold"
                  placeholder="e.g. Iron deficiency, Postpartum anxiety"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-1 flex items-center gap-1">
                  <FileText size={12} /> Doctor's Notes / Recent Info
                </label>
                <textarea 
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 transition-all h-32 resize-none text-black font-medium"
                  placeholder="Paste any instructions from your latest check-up here..."
                />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button 
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSaved ? 'bg-green-600 text-white' : 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-100'
              }`}
            >
              {isSaved ? 'All Changes Saved!' : <><Save size={20} /> Save Profile Changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
