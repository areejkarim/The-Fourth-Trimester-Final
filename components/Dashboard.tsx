
import { useState, useEffect } from 'react';
import { Sparkles, Trophy, ChefHat, Info, ExternalLink, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { UserProfile, DailyCheckIn } from '../types';
import { getPersonalizedInsights } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  streak: number;
  lastCheckIn?: DailyCheckIn;
  onStartCheckIn: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, streak, lastCheckIn, onStartCheckIn }) => {
  const [insight, setInsight] = useState<{ text: string; sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchInsight = async () => {
      if (lastCheckIn) {
        setLoading(true);
        const res = await getPersonalizedInsights(profile, lastCheckIn);
        setInsight(res);
        setLoading(false);
      }
    };
    fetchInsight();
  }, [lastCheckIn, profile]);

  const toggleTask = (task: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(task)) newSet.delete(task);
    else newSet.add(task);
    setCompletedTasks(newSet);
  };

  const getRecipe = () => {
    if (!insight) return null;
    const recipeLine = insight.text.split('\n').find(l => l.startsWith('RECIPE:'));
    return recipeLine ? recipeLine.replace('RECIPE:', '').trim() : null;
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('TASK:')) {
        const taskText = line.replace('TASK:', '').trim();
        const isDone = completedTasks.has(taskText);
        return (
          <div 
            key={index} 
            onClick={() => toggleTask(taskText)}
            className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer mb-2 ${
              isDone ? 'bg-green-50 border-green-100 opacity-60' : 'bg-[#fef9f2] border-pink-50 hover:border-pink-200'
            }`}
          >
            {isDone ? <CheckCircle2 size={20} className="text-green-500 shrink-0" /> : <Circle size={20} className="text-pink-300 shrink-0" />}
            <span className={`${isDone ? 'line-through text-gray-500' : 'text-black font-medium'}`}>{taskText}</span>
          </div>
        );
      }
      // Don't render the raw recipe line in the main content since it's in the sidebar
      if (line.startsWith('RECIPE:')) return null;
      if (line.trim() === '') return <div key={index} className="h-2" />;
      
      return <p key={index} className="mb-4 text-black leading-relaxed font-medium">{line}</p>;
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Welcome back, {profile.name}</h1>
          <p className="text-black opacity-70">How are you feeling in your fourth trimester today?</p>
        </div>
        <div className="bg-yellow-100 text-black px-6 py-3 rounded-2xl flex items-center gap-3 border border-yellow-200 shadow-sm">
          <Trophy className="text-yellow-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Daily Streak</p>
            <p className="text-xl font-black">{streak} Days</p>
          </div>
        </div>
      </header>

      {!lastCheckIn ? (
        <div className="bg-pink-50 border border-pink-100 p-8 rounded-3xl text-center">
          <h2 className="text-xl font-bold text-black mb-2">Ready for your first check-in?</h2>
          <p className="text-black opacity-70 mb-6 font-medium">Tracking your symptoms helps us give you the best recovery tips.</p>
          <button 
            onClick={onStartCheckIn}
            className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
          >
            Start Today's Check-in
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-pink-500 mb-6">
                <Sparkles size={24} />
                <h2 className="text-xl font-bold text-black">Your Recovery Checklist</h2>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-black opacity-50">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p className="font-medium">Consulting medical research databases...</p>
                </div>
              ) : insight ? (
                <div className="max-w-none">
                  {renderContent(insight.text)}
                  
                  {insight.sources.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <p className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-2 opacity-60">
                        <Info size={14} /> Research Sources
                      </p>
                      <ul className="space-y-1">
                        {insight.sources.map((src: any, i: number) => (
                          <li key={i} className="text-sm">
                            <a 
                              href={src.web?.uri} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-pink-600 font-bold hover:underline flex items-center gap-1"
                            >
                              {src.web?.title || 'Research Link'} <ExternalLink size={12} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-black opacity-60 mb-4">Check back here after your next log for new tips.</p>
                  <button onClick={onStartCheckIn} className="text-pink-600 font-bold hover:underline">
                    Update Today's Check-in
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <ChefHat className="text-yellow-600" /> Whole Food Nutrition
              </h3>
              {loading ? (
                <div className="flex items-center gap-2 text-black opacity-40 text-sm">
                  <Loader2 className="animate-spin" size={14} /> Finding recipes...
                </div>
              ) : getRecipe() ? (
                <div className="bg-white p-4 rounded-2xl border border-yellow-200">
                  <p className="text-sm text-black font-medium leading-relaxed italic">
                    {getRecipe()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-black opacity-80 leading-relaxed font-medium">
                  Complete your check-in to see personalized, easy recipes tailored to your recovery needs.
                </p>
              )}
            </div>

            <div className="bg-pink-100 p-6 rounded-3xl border border-pink-200">
              <h3 className="text-lg font-bold text-black mb-2">Milestone Progress</h3>
              <div className="w-full bg-white rounded-full h-2 mb-4">
                <div className="bg-pink-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (streak % 7) * 14.2)}%` }}></div>
              </div>
              <p className="text-sm text-black opacity-80 font-bold">
                {streak > 0 
                  ? `${7 - (streak % 7)} days to your next milestone!`
                  : "Complete a check-in to start your streak."}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
