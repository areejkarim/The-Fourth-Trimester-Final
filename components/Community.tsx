
import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, MapPin, Plus, Send, Clock, Coffee, TreePine, CornerDownRight } from 'lucide-react';
import { UserProfile, ForumPost, CommunityEvent, ForumReply } from '../types';

interface CommunityProps {
  user: UserProfile;
}

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'forum' | 'events'>('forum');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [newPost, setNewPost] = useState('');
  const [userLocation] = useState('Hamilton, Ontario');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const savedPosts = localStorage.getItem('ft_posts');
    const savedEvents = localStorage.getItem('ft_events');
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: ForumPost[] = [
        { 
          id: '1', 
          authorName: 'Emma R.', 
          authorEmail: 'emma@example.com', 
          content: 'Does anyone in Hamilton know a good stroller-friendly trail near Gage Park?', 
          timestamp: Date.now() - 3600000, 
          location: 'Hamilton, Ontario',
          replies: [
            { id: 'r1', authorName: 'Jessica M.', content: 'The outer loop is paved and very smooth!', timestamp: Date.now() - 1800000 }
          ]
        },
        { 
          id: '2', 
          authorName: 'Sarah L.', 
          authorEmail: 'sarah@example.com', 
          content: 'Just moved to the Westdale area! Would love to connect with other new moms.', 
          timestamp: Date.now() - 7200000, 
          location: 'Hamilton, Ontario',
          replies: []
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('ft_posts', JSON.stringify(initialPosts));
    }

    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      const initialEvents: CommunityEvent[] = [
        { id: 'e1', organizerName: 'Sarah L.', locationName: 'Gage Park', locationType: 'Park', date: '2024-05-15', time: '10:00 AM', description: 'Morning stroller walk near the fountain!', attendees: ['sarah@example.com'] },
        { id: 'e2', organizerName: 'Jessica M.', locationName: 'Mulberry Coffeehouse', locationType: 'Coffee Shop', date: '2024-05-18', time: '02:00 PM', description: 'Coffee and chat for postpartum support.', attendees: ['jessica@example.com'] }
      ];
      setEvents(initialEvents);
      localStorage.setItem('ft_events', JSON.stringify(initialEvents));
    }
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const post: ForumPost = {
      id: Date.now().toString(),
      authorName: user.name,
      authorEmail: user.email,
      content: newPost,
      timestamp: Date.now(),
      location: userLocation,
      replies: []
    };
    
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('ft_posts', JSON.stringify(updated));
    setNewPost('');
  };

  const handleCreateReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const reply: ForumReply = {
      id: Date.now().toString(),
      authorName: user.name,
      content: replyContent,
      timestamp: Date.now()
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...(p.replies || []), reply] };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem('ft_posts', JSON.stringify(updated));
    setReplyContent('');
    setReplyingToId(null);
  };

  const handleJoinEvent = (eventId: string) => {
    const updated = events.map(ev => {
      if (ev.id === eventId && !ev.attendees.includes(user.email)) {
        return { ...ev, attendees: [...ev.attendees, user.email] };
      }
      return ev;
    });
    setEvents(updated);
    localStorage.setItem('ft_events', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Community</h1>
          <p className="text-black opacity-60 flex items-center gap-1 mt-1 font-medium">
            <MapPin size={14} /> Showing results for <span className="text-pink-600 font-bold">{userLocation}</span>
          </p>
        </div>
        <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex">
          <button 
            onClick={() => setActiveSubTab('forum')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'forum' ? 'bg-pink-100 text-black' : 'text-black opacity-40 hover:opacity-100'}`}
          >
            Forum
          </button>
          <button 
            onClick={() => setActiveSubTab('events')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'events' ? 'bg-pink-100 text-black' : 'text-black opacity-40 hover:opacity-100'}`}
          >
            Local Events
          </button>
        </div>
      </div>

      {activeSubTab === 'forum' ? (
        <div className="space-y-6">
          <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Ask a question or share an update with other mothers nearby..."
              className="w-full p-4 bg-[#fef9f2] rounded-2xl border-none focus:ring-2 focus:ring-pink-100 transition-all mb-4 resize-none h-24 text-black font-medium"
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-pink-600 transition-all"
              >
                <Send size={18} /> Post
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-pink-100 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{post.authorName}</h4>
                    <p className="text-xs text-black opacity-40 flex items-center gap-1 font-bold">
                      <Clock size={10} /> {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-black leading-relaxed font-medium mb-4">{post.content}</p>
                
                {/* Replies Display */}
                {post.replies && post.replies.length > 0 && (
                  <div className="space-y-3 pl-6 border-l-2 border-pink-50 mt-4 mb-4">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="bg-[#fef9f2]/50 p-3 rounded-xl border border-pink-50/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-pink-600">{reply.authorName}</span>
                          <span className="text-[10px] text-black opacity-30">• {new Date(reply.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-black opacity-80 font-medium">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-4 pt-4 border-t border-gray-50">
                  {replyingToId === post.id ? (
                    <div className="flex flex-col gap-2 animate-fadeIn">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full p-3 bg-[#fef9f2] rounded-xl border border-pink-50 text-sm font-medium resize-none focus:ring-1 focus:ring-pink-200 outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => setReplyingToId(null)}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold text-black opacity-40 hover:opacity-60"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleCreateReply(post.id)}
                          className="bg-pink-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-600"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReplyingToId(post.id)}
                      className="text-xs font-bold text-pink-600 flex items-center gap-1 hover:underline self-start"
                    >
                      <MessageSquare size={14} /> Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-black">Plan a Meetup</h3>
              <p className="text-sm text-black opacity-70 font-medium">Coffee, walks, or park dates – connect in Hamilton.</p>
            </div>
            <button className="bg-white text-yellow-600 p-3 rounded-full shadow-sm hover:scale-110 transition-all">
              <Plus size={24} />
            </button>
          </div>

          {events.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${event.locationType === 'Park' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {event.locationType === 'Park' ? <TreePine size={24} /> : <Coffee size={24} />}
                  </div>
                  <span className="text-xs font-bold text-black opacity-40 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">{event.locationType}</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-1">{event.locationName}</h3>
                <p className="text-sm text-black opacity-60 mb-4 font-medium">{event.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-black font-bold">
                    <Calendar size={16} className="text-pink-500" /> {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black font-bold">
                    <Clock size={16} className="text-pink-500" /> {event.time}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex -space-x-2">
                  {event.attendees.map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                      {a.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleJoinEvent(event.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${event.attendees.includes(user.email) ? 'bg-gray-100 text-black opacity-40 cursor-default' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                >
                  {event.attendees.includes(user.email) ? 'Joined' : 'Join In'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
