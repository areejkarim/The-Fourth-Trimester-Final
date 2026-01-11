
import React, { useState } from 'react';
import { Smile, Frown, Thermometer, Droplets, Zap, Activity } from 'lucide-react';
import { DailyCheckIn } from '../types';

interface CheckInProps {
  onSave: (entry: DailyCheckIn) => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onSave }) => {
  const [data, setData] = useState<Partial<DailyCheckIn>>({
    happiness: 3,
    pain: 1,
    nausea: 1,
    swelling: 1,
    fatigue: 3,
    milkSupply: 3,
    notes: ''
  });

  const metrics = [
    { key: 'happiness', label: 'Happiness / Mood', icon: Smile, color: 'text-yellow-500' },
    { key: 'pain', label: 'Physical Pain', icon: Frown, color: 'text-red-500' },
    { key: 'nausea', label: 'Nausea', icon: Thermometer, color: 'text-green-500' },
    { key: 'swelling', label: 'Swelling', icon: Activity, color: 'text-blue-500' },
    { key: 'fatigue', label: 'Fatigue / Energy', icon: Zap, color: 'text-purple-500' },
    { key: 'milkSupply', label: 'Milk Supply', icon: Droplets, color: 'text-blue-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...data,
      date: new Date().toISOString(),
    } as DailyCheckIn);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-black mb-2">Daily Check-in</h2>
        <p className="text-black opacity-60 mb-8 font-medium">Take a moment to check in with yourself. It only takes a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {metrics.map((metric) => (
              <div key={metric.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <metric.icon size={18} className={metric.color} />
                    {metric.label}
                  </label>
                  <span className="text-xs font-bold text-black opacity-40">{data[metric.key as keyof DailyCheckIn]}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={data[metric.key as keyof DailyCheckIn] as number}
                  onChange={(e) => setData({ ...data, [metric.key]: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-black font-black uppercase tracking-widest opacity-30">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-black">Any specific notes for today?</label>
            <textarea
              className="w-full p-4 rounded-2xl border border-pink-50 bg-[#fef9f2] focus:ring-2 focus:ring-pink-200 outline-none transition-all h-24 text-black font-medium placeholder:text-gray-400"
              placeholder="How are you really feeling? (e.g., Baby slept well, felt a bit tired...)"
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 shadow-lg shadow-pink-100 transition-all active:scale-95"
          >
            Complete Check-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;
