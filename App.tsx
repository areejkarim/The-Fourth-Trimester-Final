
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import Community from './components/Community';
import Profile from './components/Profile';
import { UserProfile, DailyCheckIn } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [streak, setStreak] = useState(0);

  // Load data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ft_user');
    const savedCheckIns = localStorage.getItem('ft_checkins');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCheckIns) {
      const parsed = JSON.parse(savedCheckIns);
      setCheckIns(parsed);
      calculateStreak(parsed);
    }
  }, []);

  const calculateStreak = (history: DailyCheckIn[]) => {
    if (history.length === 0) {
      setStreak(0);
      return;
    }
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);

    for (const entry of sorted) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        lastDate = entryDate;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('ft_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ft_user');
    setActiveTab('dashboard');
  };

  const handleCheckIn = (entry: DailyCheckIn) => {
    const updated = [entry, ...checkIns];
    setCheckIns(updated);
    localStorage.setItem('ft_checkins', JSON.stringify(updated));
    calculateStreak(updated);
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('ft_user', JSON.stringify(updatedProfile));
  };

  if (!user) {
    return <Auth onAuthSuccess={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      userName={user.name}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          profile={user} 
          streak={streak} 
          lastCheckIn={checkIns[0]} 
          onStartCheckIn={() => setActiveTab('checkin')}
        />
      )}
      {activeTab === 'checkin' && (
        <CheckIn onSave={handleCheckIn} />
      )}
      {activeTab === 'community' && (
        <Community user={user} />
      )}
      {activeTab === 'profile' && (
        <Profile profile={user} onUpdate={handleUpdateProfile} />
      )}
    </Layout>
  );
};

export default App;
