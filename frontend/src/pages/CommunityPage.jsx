import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageSquare, Share2, Bookmark, Plus, Search, 
  Filter, Sparkles, MapPin, User, Compass, Star, Check
} from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Maya Kapoor',
    handle: '@maya_k',
    avatar: 'M',
    location: 'Bali, Indonesia',
    type: 'TRAVEL STORY · BALI',
    title: '“I stopped rushing through Bali.”',
    description: 'A five-day route built around slow mornings, local food, temples and quiet places away from the busiest tourist streets.',
    tags: ['Nature', 'Food', '5 Days', 'Relaxed'],
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=600&q=80'
    ],
    likes: 128,
    isLiked: false,
    comments: 24,
    isSaved: false,
    destination: 'Bali',
    category: 'popular'
  },
  {
    id: 2,
    author: 'Riya Shah',
    handle: '@riya_explores',
    avatar: 'R',
    location: 'Paris, France',
    type: 'CITY GUIDE · PARIS',
    title: '“Paris beyond the postcard.”',
    description: 'What changed when I traded a checklist of landmarks for neighbourhood walks, small cafés and slower afternoons.',
    tags: ['Culture', 'Food', '4 Days', 'Walking'],
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80'
    ],
    likes: 94,
    isLiked: false,
    comments: 17,
    isSaved: false,
    destination: 'Paris',
    category: 'recent'
  },
  {
    id: 3,
    author: 'Kenji Sato',
    handle: '@kenji_tokyo',
    avatar: 'K',
    location: 'Tokyo, Japan',
    type: 'NEIGHBOURHOOD WALK · TOKYO',
    title: '“Late nights in Shibuya & Omoide Yokocho.”',
    description: 'Neon alleys, hidden yakitori counters, and quiet early morning shrines before the city wakes up.',
    tags: ['Nightlife', 'Culinary', '7 Days', 'Urban'],
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
    ],
    likes: 215,
    isLiked: false,
    comments: 42,
    isSaved: false,
    destination: 'Tokyo',
    category: 'popular'
  }
];

export default function CommunityPage({ onNavigate, onStartItinerary }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStory, setNewStory] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !p.isLiked;
        return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const handleSave = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isSaved = !p.isSaved;
        showToast(isSaved ? 'Story saved to your bookmarks!' : 'Removed from bookmarks');
        return { ...p, isSaved };
      }
      return p;
    }));
  };

  const handleUseItinerary = (destination) => {
    if (onStartItinerary) {
      onStartItinerary({ city: destination });
    } else if (onNavigate) {
      onNavigate('planner-flow');
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle || !newDestination) return;

    const newPost = {
      id: Date.now(),
      author: 'You (Traveler)',
      handle: '@you',
      avatar: 'Y',
      location: newDestination,
      type: `TRAVEL STORY · ${newDestination.toUpperCase()}`,
      title: newTitle,
      description: newStory || 'Exploring unique places and local food secrets.',
      tags: ['Custom', 'Community'],
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80'
      ],
      likes: 1,
      isLiked: true,
      comments: 0,
      isSaved: false,
      destination: newDestination,
      category: 'recent'
    };

    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDestination('');
    setNewStory('');
    showToast('Your travel story has been published! 🌟');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'popular') return matchesSearch && post.likes > 100;
    if (activeTab === 'recent') return matchesSearch && post.id > 1;
    return matchesSearch;
  });

  return (
    <div 
      style={{ 
        backgroundColor: '#42151c', 
        background: 'linear-gradient(180deg, #591d26 0%, #4d1921 48%, #42151c 100%)', 
        color: '#c9b7ac', 
        minHeight: '100vh', 
        fontFamily: "'Neuton', serif" 
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-0 end-0 m-4 p-3 rounded shadow-lg"
            style={{ backgroundColor: '#c9b7ac', color: '#42151c', border: '1px solid #9d887e', zIndex: 2000, fontWeight: 700 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container py-5" style={{ maxWidth: '1250px' }}>
        
        {/* HEADER SECTION */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 pb-2">
          <div>
            <div style={{ fontFamily: "'Pangolin', cursive", color: '#a9938b', fontSize: '1.1rem' }}>
              TRAVEL TOGETHER
            </div>
            <h1 className="m-0 fw-bold" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: '#c9b7ac', lineHeight: 1 }}>
              Community
            </h1>
            <p className="m-0 mt-2" style={{ maxWidth: '650px', color: '#a99189', fontSize: '1.1rem', lineHeight: 1.45 }}>
              Discover real itineraries, travel stories and ideas shared by people who have actually been there.
            </p>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn fw-bold px-4 py-2.5 transition-all text-nowrap" 
            style={{ backgroundColor: '#c9b7ac', color: '#42151c', border: '1px solid #c9b7ac', borderRadius: '4px', fontSize: '1rem' }}
          >
            + Share your journey
          </button>
        </div>

        {/* SEARCH AND CONTROLS BAR */}
        <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#351116', border: '1px solid #70404a' }}>
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md">
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#927b76' }} />
                <input
                  type="text"
                  placeholder="Search destinations, stories, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control ps-5 py-2"
                  style={{ backgroundColor: '#3d141a', border: '1px solid #70404a', color: '#c9b7ac', fontSize: '0.95rem' }}
                />
              </div>
            </div>
            <div className="col-auto">
              <button className="btn px-3 py-2" style={{ backgroundColor: '#3f141b', color: '#b7a49a', border: '1px solid #70404a', fontSize: '0.95rem' }}>
                Group by
              </button>
            </div>
            <div className="col-auto">
              <button className="btn px-3 py-2" style={{ backgroundColor: '#3f141b', color: '#b7a49a', border: '1px solid #70404a', fontSize: '0.95rem' }}>
                Filter
              </button>
            </div>
            <div className="col-auto">
              <button className="btn px-3 py-2" style={{ backgroundColor: '#3f141b', color: '#b7a49a', border: '1px solid #70404a', fontSize: '0.95rem' }}>
                Sort by...
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="d-flex gap-4 mb-4 pb-2" style={{ borderBottom: '1px solid #70404a' }}>
          {[
            { id: 'all', label: 'Community' },
            { id: 'popular', label: 'Popular' },
            { id: 'recent', label: 'Recent' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn btn-link text-decoration-none p-0 pb-2 position-relative fw-bold"
              style={{
                color: activeTab === tab.id ? '#c9b7ac' : '#a48d86',
                border: 'none',
                fontSize: '1.1rem'
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '2px', backgroundColor: '#c9b7ac' }} />
              )}
            </button>
          ))}
        </div>

        {/* LAYOUT GRID */}
        <div className="row g-4">
          
          {/* FEED COLUMN */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              {filteredPosts.map(post => (
                <article 
                  key={post.id} 
                  className="rounded overflow-hidden shadow-sm transition-all"
                  style={{ backgroundColor: '#bba89e', color: '#40272c', border: '1px solid #957b72' }}
                >
                  {/* Post Header */}
                  <div className="p-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                        style={{ width: '42px', height: '42px', backgroundColor: '#591d26', color: '#c9b7ac', fontFamily: "'Pangolin', cursive", fontSize: '18px' }}
                      >
                        {post.avatar}
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '1.05rem', color: '#40272c' }}>{post.author}</div>
                        <div style={{ color: '#705b5d', fontSize: '0.82rem' }}>{post.location}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast(`Now following ${post.author}!`)}
                      className="btn btn-sm px-3 py-1" 
                      style={{ border: '1px solid #806760', color: '#591d26', backgroundColor: 'transparent', fontSize: '0.85rem' }}
                    >
                      Follow
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-3 pb-3">
                    <div style={{ color: '#591d26', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {post.type}
                    </div>
                    <h2 className="fw-bold m-0 mb-2" style={{ color: '#591d26', fontSize: '1.7rem', lineHeight: 1.05 }}>
                      {post.title}
                    </h2>
                    <p className="m-0 mb-3" style={{ color: '#665457', fontSize: '1rem', lineHeight: 1.4 }}>
                      {post.description}
                    </p>

                    <div className="d-flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="badge px-2 py-1" style={{ backgroundColor: '#aa978d', border: '1px solid #917970', color: '#59373e', fontWeight: 500, fontSize: '0.78rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Photo Grid */}
                  <div className="row g-1 mx-0" style={{ height: '260px', overflow: 'hidden' }}>
                    <div className="col-6 h-100 p-0">
                      <img src={post.images[0]} alt="Travel" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="col-3 h-100 p-0">
                      <img src={post.images[1]} alt="Travel" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="col-3 h-100 p-0">
                      <img src={post.images[2]} alt="Travel" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>

                  {/* Use Itinerary Button */}
                  <div className="p-3">
                    <button 
                      onClick={() => handleUseItinerary(post.destination)}
                      className="btn w-100 py-2.5 fw-bold text-cream transition-all" 
                      style={{ backgroundColor: '#591d26', color: '#c9b7ac', border: 'none', borderRadius: '4px' }}
                    >
                      Use this itinerary for {post.destination} &rarr;
                    </button>
                  </div>

                  {/* Post Footer Actions */}
                  <div className="p-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid #a08b82' }}>
                    <div className="d-flex gap-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                        style={{ color: post.isLiked ? '#591d26' : '#665255', fontWeight: post.isLiked ? 700 : 400 }}
                      >
                        <Heart size={16} fill={post.isLiked ? '#591d26' : 'none'} />
                        <span>{post.likes}</span>
                      </button>

                      <button 
                        onClick={() => showToast('Comments section coming soon!')}
                        className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                        style={{ color: '#665255' }}
                      >
                        <MessageSquare size={16} />
                        <span>{post.comments}</span>
                      </button>

                      <button 
                        onClick={() => showToast('Share link copied to clipboard!')}
                        className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                        style={{ color: '#665255' }}
                      >
                        <Share2 size={16} />
                        <span>Share</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => handleSave(post.id)}
                      className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                      style={{ color: '#591d26', fontWeight: 600 }}
                    >
                      <Bookmark size={16} fill={post.isSaved ? '#591d26' : 'none'} />
                      <span>{post.isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              
              {/* Card 1: Popular Destinations */}
              <div className="p-4 rounded" style={{ backgroundColor: '#48171f', border: '1px solid #70404a' }}>
                <h3 className="m-0 mb-3 fw-bold" style={{ color: '#c9b7ac', fontSize: '1.3rem' }}>Popular Destinations</h3>
                {[
                  { name: 'Bali, Indonesia', count: '1,420 itineraries', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Paris, France', count: '980 itineraries', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Tokyo, Japan', count: '2,100 itineraries', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80' },
                  { name: 'Rome, Italy', count: '850 itineraries', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=150&q=80' }
                ].map((d, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleUseItinerary(d.name.split(',')[0])}
                    className="d-flex align-items-center gap-3 py-2 cursor-pointer transition-all border-bottom" 
                    style={{ borderColor: '#64303a', cursor: 'pointer' }}
                  >
                    <img src={d.img} alt={d.name} className="rounded" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                    <div>
                      <div className="fw-bold" style={{ color: '#c9b7ac', fontSize: '0.95rem' }}>{d.name}</div>
                      <div style={{ color: '#907771', fontSize: '0.78rem' }}>{d.count}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 2: Top Community Travelers */}
              <div className="p-4 rounded" style={{ backgroundColor: '#48171f', border: '1px solid #70404a' }}>
                <h3 className="m-0 mb-3 fw-bold" style={{ color: '#c9b7ac', fontSize: '1.3rem' }}>Top Contributors</h3>
                {[
                  { name: 'Maya Kapoor', trips: '24 stories', avatar: 'M' },
                  { name: 'Riya Shah', trips: '18 stories', avatar: 'R' },
                  { name: 'Kenji Sato', trips: '31 stories', avatar: 'K' }
                ].map((c, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 py-2 border-bottom" style={{ borderColor: '#64303a' }}>
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '36px', height: '36px', backgroundColor: '#6a2b35', color: '#c9b7ac', fontFamily: "'Pangolin', cursive" }}
                    >
                      {c.avatar}
                    </div>
                    <div>
                      <div className="fw-bold" style={{ color: '#c9b7ac', fontSize: '0.92rem' }}>{c.name}</div>
                      <div style={{ color: '#907771', fontSize: '0.78rem' }}>{c.trips}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 3: Community Stats */}
              <div className="p-4 rounded" style={{ backgroundColor: '#351116', border: '1px solid #70404a' }}>
                <div className="row g-2 text-center">
                  <div className="col-4 p-2" style={{ backgroundColor: '#42151c', border: '1px solid #70404a' }}>
                    <strong className="d-block" style={{ color: '#c9b7ac', fontSize: '1.3rem' }}>14.2k</strong>
                    <span style={{ color: '#8f7773', fontSize: '0.75rem' }}>Travelers</span>
                  </div>
                  <div className="col-4 p-2" style={{ backgroundColor: '#42151c', border: '1px solid #70404a' }}>
                    <strong className="d-block" style={{ color: '#c9b7ac', fontSize: '1.3rem' }}>8.9k</strong>
                    <span style={{ color: '#8f7773', fontSize: '0.75rem' }}>Stories</span>
                  </div>
                  <div className="col-4 p-2" style={{ backgroundColor: '#42151c', border: '1px solid #70404a' }}>
                    <strong className="d-block" style={{ color: '#c9b7ac', fontSize: '1.3rem' }}>92</strong>
                    <span style={{ color: '#8f7773', fontSize: '0.75rem' }}>Countries</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* CREATE POST MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-4 rounded shadow-lg w-100"
              style={{ maxWidth: '540px', backgroundColor: '#48171f', border: '1px solid #70404a', color: '#c9b7ac' }}
            >
              <h3 className="fw-bold mb-3" style={{ color: '#c9b7ac' }}>Share Your Travel Story</h3>
              <form onSubmit={handleCreatePost}>
                <div className="mb-3">
                  <label className="form-label small fw-bold" style={{ color: '#a99189' }}>DESTINATION</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paris, France"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="form-control py-2"
                    style={{ backgroundColor: '#3d141a', border: '1px solid #70404a', color: '#c9b7ac' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold" style={{ color: '#a99189' }}>STORY TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Days in the heart of Montmartre"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="form-control py-2"
                    style={{ backgroundColor: '#3d141a', border: '1px solid #70404a', color: '#c9b7ac' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold" style={{ color: '#a99189' }}>STORY & HIGHLIGHTS</label>
                  <textarea
                    rows={4}
                    placeholder="Write about your favourite spots, local cafes, and travel tips..."
                    value={newStory}
                    onChange={(e) => setNewStory(e.target.value)}
                    className="form-control py-2"
                    style={{ backgroundColor: '#3d141a', border: '1px solid #70404a', color: '#c9b7ac' }}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="btn px-3 py-2"
                    style={{ backgroundColor: '#3f141b', color: '#c9b7ac', border: '1px solid #70404a' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn px-4 py-2 fw-bold"
                    style={{ backgroundColor: '#c9b7ac', color: '#42151c', border: 'none' }}
                  >
                    Publish Story
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
