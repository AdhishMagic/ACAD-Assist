import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Department,
  Semester,
  UserProfile,
  AppScreen,
  Subject,
  SubjectTab,
  ChatMessage,
  QuizQuestion
} from './types';
import { COLORS, SUBJECTS, MOCK_IMPORTANT_QS, MOCK_REFERENCES } from './constants';
import * as GeminiService from './services/geminiService';
import { decodeAudioData, playAudioBuffer } from './services/audioService';

// --- Icons (Inline SVG) ---
const Icons = {
  Book: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  GradCap: () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
  User: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ChevronLeft: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  Microphone: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  VolumeUp: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>,
  Sun: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l1.41-1.41M4.93 19.07l1.41-1.41" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  ),
};

// --- Helper Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const variants: any = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-secondary', // Reusing secondary for outline look in glassmorphism
    ghost: 'btn-ghost'
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`btn ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`glass-card ${className}`}>
    {children}
  </div>
);

// --- Main App Component ---

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.AUTH);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('acad_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setScreen(parsed.isSetupComplete ? AppScreen.DASHBOARD : AppScreen.ONBOARDING);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogin = (email: string) => {
    // Simulated Login
    const tempUser: UserProfile = {
      name: email.split('@')[0],
      email: email,
      department: Department.CSE, // Default
      semester: 1, // Default
      isSetupComplete: false
    };

    // Check if user exists in local storage for persistence logic mock
    const existing = localStorage.getItem('acad_user');
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email) {
        setUser(parsed);
        setScreen(parsed.isSetupComplete ? AppScreen.DASHBOARD : AppScreen.ONBOARDING);
        return;
      }
    }

    setUser(tempUser);
    setScreen(AppScreen.ONBOARDING);
  };

  const handleOnboardingComplete = (dept: Department, sem: Semester) => {
    if (!user) return;
    const updatedUser = { ...user, department: dept, semester: sem, isSetupComplete: true };
    setUser(updatedUser);
    localStorage.setItem('acad_user', JSON.stringify(updatedUser));
    setScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('acad_user');
    setUser(null);
    setScreen(AppScreen.AUTH);
  };

  const filteredSubjects = SUBJECTS.filter(s => s.department === user?.department && s.semester === user?.semester);

  const handleBack = () => {
    if (screen === AppScreen.SUBJECT_DETAIL) {
      setSelectedSubject(null);
      setScreen(AppScreen.DASHBOARD);
    } else if (screen === AppScreen.SETTINGS) {
      setScreen(AppScreen.DASHBOARD);
    } else if (screen === AppScreen.ONBOARDING) {
      setScreen(user?.isSetupComplete ? AppScreen.DASHBOARD : AppScreen.AUTH);
    } else {
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative font-sans">
      {/* Navbar - Sticky */}
      {screen !== AppScreen.AUTH && (
        <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="back-btn" aria-label="Go back">
              <Icons.ChevronLeft />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedSubject(null); setScreen(AppScreen.DASHBOARD); }}>
              <img src="/logo.svg" alt="ACAD ASSIST" className="h-12 w-12 rounded-lg" />
              <h1 className="font-display text-2xl font-bold text-[#5A5340] tracking-wide">ACAD ASSIST</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="font-bold text-[#5A5340] text-sm">{user?.name}</p>
              <p className="text-xs text-stone-500">{user?.department} - Sem {user?.semester}</p>
            </div>
            <button
              onClick={() => setIsDark(d => !d)}
              className={`theme-toggle ${isDark ? 'active' : ''}`}
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button onClick={() => setScreen(AppScreen.SETTINGS)} className="back-btn" aria-label="Open settings" title="Subject & Semester settings">
              <Icons.Settings />
            </button>
            <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 ml-2 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition">LOGOUT</button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">

        {screen === AppScreen.AUTH && <AuthScreen onLogin={handleLogin} />}

        {screen === AppScreen.ONBOARDING && (
          <OnboardingScreen
            initialDept={user?.department || Department.CSE}
            initialSem={user?.semester || 1}
            onComplete={handleOnboardingComplete}
          />
        )}

        {screen === AppScreen.SETTINGS && user && (
          <OnboardingScreen
            initialDept={user.department}
            initialSem={user.semester}
            onComplete={handleOnboardingComplete}
            isSettings={true}
            onCancel={() => setScreen(AppScreen.DASHBOARD)}
          />
        )}

        {screen === AppScreen.DASHBOARD && (
          <div className="container py-8 animate-fade-in">
            <div className="mb-10">
              <h2 className="text-4xl text-[#5A5340] mb-2">Welcome Back, <span className="text-[#BDB395]">{user?.name}</span>!</h2>
              <p className="text-stone-500 text-lg">Select a subject to begin your study session.</p>
            </div>

            {filteredSubjects.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <p className="text-xl text-stone-400">No subjects found for this Department/Semester.</p>
                <button onClick={() => setScreen(AppScreen.SETTINGS)} className="mt-4 text-[#BDB395] font-bold hover:text-[#A39A7F] underline">Change Settings</button>
              </div>
            ) : (
              <div className="grid-responsive">
                {filteredSubjects.map(sub => (
                  <Card key={sub.code} onClick={() => { setSelectedSubject(sub); setScreen(AppScreen.SUBJECT_DETAIL); }} className="cursor-pointer group relative overflow-hidden bg-white">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#BDB395]"></div>
                    <div className="p-6 pl-8">
                      <span className="inline-block px-3 py-1 bg-[#F6F0F0] text-xs font-bold text-stone-500 rounded-full mb-4 border border-[#E7E5E4]">{sub.code}</span>
                      <h3 className="text-xl font-bold text-[#5A5340] mb-3 leading-tight group-hover:text-[#BDB395] transition-colors">{sub.name}</h3>
                      <p className="text-sm text-stone-500 line-clamp-2 mb-6">{sub.syllabus_overview}</p>
                      <div className="flex items-center text-[#BDB395] font-bold text-sm group-hover:translate-x-2 transition-transform">
                        <span>Open Module</span>
                        <span className="ml-2">→</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {screen === AppScreen.SUBJECT_DETAIL && selectedSubject && (
          <SubjectModule
            subject={selectedSubject}
            onBack={() => { setSelectedSubject(null); setScreen(AppScreen.DASHBOARD); }}
          />
        )}

      </main>
    </div>
  );
}

// --- Sub-Screens ---

const AuthScreen = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="mb-8 text-center animate-fade-in">
        <div className="inline-block mb-4">
          <img src="/logo.svg" alt="ACAD ASSIST" className="h-40 w-40 mx-auto drop-shadow-2xl rounded-2xl" />
        </div>
        <h1 className="text-5xl font-bold mb-2 text-[#5A5340]">ACAD ASSIST</h1>
        <p className="text-xl text-stone-500">Your AI-Powered University Companion</p>
      </div>

      <Card className="w-full max-w-md p-8 animate-fade-in bg-white" style={{ animationDelay: '0.1s' }}>
        <div className="flex mb-8 bg-[#F6F0F0] p-1 rounded-lg">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${isLogin ? 'bg-white text-[#BDB395] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!isLogin ? 'bg-white text-[#BDB395] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@annauniv.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full mt-6 py-3 text-lg">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const OnboardingScreen = ({ initialDept, initialSem, onComplete, isSettings, onCancel }: any) => {
  const [dept, setDept] = useState<Department>(initialDept);
  const [sem, setSem] = useState<Semester>(initialSem);

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-5xl p-8 animate-fade-in bg-white">
        <h2 className="text-3xl font-bold text-[#5A5340] mb-8 text-center">
          {isSettings ? 'Profile Settings' : 'Setup Your Profile'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Department Selection */}
          <div>
            <label className="block font-bold text-stone-500 mb-3 uppercase text-xs tracking-wider">Select Department</label>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(Department).map((d) => (
                <div
                  key={d}
                  onClick={() => setDept(d)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all font-medium ${dept === d ? 'border-[#BDB395] bg-[#F2E2B1] text-[#5A5340] shadow-sm' : 'border-[#E7E5E4] bg-[#F6F0F0] text-stone-500 hover:bg-[#E5DCC3]'}`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Selected Department & Semester */}
          <div className="flex flex-col">
            {/* Selected Department Display */}
            <div className="mb-6 p-4 bg-[#F2E2B1] rounded-xl border-l-4 border-[#BDB395]">
              <p className="text-xs font-bold uppercase text-stone-500 mb-1">Selected Department</p>
              <p className="text-lg font-bold text-[#5A5340]">{dept}</p>
            </div>

            {/* Semester Selection */}
            <div>
              <label className="block font-bold text-stone-500 mb-3 uppercase text-xs tracking-wider">Current Semester</label>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSem(s as Semester)}
                    className={`${s === 8 ? 'px-4 py-2 h-12' : 'w-12 h-12'} rounded-full font-bold transition-all flex items-center justify-center ${sem === s ? 'bg-[#BDB395] text-white shadow-lg scale-110' : 'bg-[#F6F0F0] text-stone-400 hover:bg-[#E5DCC3] border border-[#E7E5E4]'}`}
                  >
                    {s === 8 ? 'Electives' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          {isSettings && <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>}
          <Button onClick={() => onComplete(dept, sem)} className="flex-1 w-full py-3 text-lg">
            {isSettings ? 'Save Changes' : 'Get Started'}
          </Button>
        </div>
      </Card>
    </div>
  );
};


// --- Subject Module Component ---

const SubjectModule = ({ subject, onBack }: { subject: Subject, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<SubjectTab>(SubjectTab.CHAT);

  return (
    <div className="container h-[calc(100vh-100px)] flex flex-col py-4">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2 mb-6 text-stone-400 text-sm">
        <button onClick={onBack} className="hover:text-[#BDB395] flex items-center gap-1 transition-colors"><Icons.ChevronLeft /> Back</button>
        <span>/</span>
        <span className="font-bold text-[#BDB395]">{subject.code}</span>
      </div>

      <div className="glass-card flex flex-col flex-1 overflow-hidden border-0 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-[#E7E5E4] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FDFBF7]">
          <div>
            <h1 className="text-3xl font-bold text-[#5A5340] mb-1">{subject.name}</h1>
            <p className="text-stone-500">{subject.department} • Semester {subject.semester}</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F6F0F0] p-1 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: SubjectTab.CHAT, label: 'AI Tutor', icon: <Icons.Microphone /> },
              { id: SubjectTab.SYLLABUS, label: 'Syllabus', icon: <Icons.Book /> },
              { id: SubjectTab.IMPORTANT_QS, label: 'Imp. Qs', icon: <Icons.GradCap /> },
              { id: SubjectTab.QUIZ, label: 'Quiz', icon: <Icons.Settings /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white text-[#BDB395] shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-[#E5DCC3]'}`}
              >
                <span className="w-4 h-4">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 relative bg-white">
          {activeTab === SubjectTab.SYLLABUS && (
            <div className="prose max-w-none text-stone-700">
              <h3 className="text-2xl font-bold text-[#5A5340] mb-6">Official Syllabus</h3>

              {subject.detailed_syllabus ? (
                <div className="space-y-6">
                  {subject.detailed_syllabus.map((unit) => (
                    <div key={unit.unitNumber} className="bg-[#F6F0F0] p-6 rounded-xl border-l-4 border-[#BDB395]">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-bold text-[#5A5340]">Unit {unit.unitNumber}: {unit.title}</h4>
                        {unit.periods && <span className="text-xs font-bold bg-[#E5DCC3] text-[#5A5340] px-2 py-1 rounded-md">{unit.periods} Periods</span>}
                      </div>
                      <p className="leading-relaxed text-stone-600 text-sm md:text-base">{unit.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F6F0F0] p-8 rounded-xl border-l-4 border-[#BDB395]">
                  <p className="leading-relaxed whitespace-pre-line text-stone-600 text-lg">{subject.syllabus_overview}</p>
                  <p className="mt-6 text-stone-400 italic">...Full syllabus loaded from university database.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === SubjectTab.IMPORTANT_QS && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-[#5A5340] mb-6">Frequently Asked Questions</h3>
              {MOCK_IMPORTANT_QS.map((q, idx) => (
                <div key={idx} className="p-6 border border-[#E7E5E4] rounded-xl hover:bg-[#FDFBF7] transition bg-white">
                  <span className="text-[#BDB395] font-bold mr-3 text-lg">Q{idx + 1}.</span>
                  <span className="font-medium text-stone-700 text-lg">{q}</span>
                </div>
              ))}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#5A5340] mb-6">References</h3>
                <ul className="space-y-3">
                  {MOCK_REFERENCES.map((ref, idx) => (
                    <li key={idx}>
                      <a href={ref.link} className="flex items-center gap-3 p-4 rounded-lg bg-[#F6F0F0] hover:bg-[#E5DCC3] transition group">
                        <span className="text-[#BDB395] group-hover:text-[#5A5340]">🔗</span>
                        <span className="text-[#BDB395] underline group-hover:text-[#5A5340] font-medium">{ref.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === SubjectTab.CHAT && <ChatInterface subject={subject} />}

          {activeTab === SubjectTab.QUIZ && <QuizInterface subject={subject} />}
        </div>
      </div>
    </div>
  );
};

// --- Feature Components ---

const ChatInterface = ({ subject }: { subject: Subject }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Hello! I'm your AI Tutor for **${subject.name}**. Ask me about any topic, and I'll help you prepare a 2-mark or 16-mark answer!`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await GeminiService.generateStudyContent(userMsg.text, subject.name);

    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  const handleSpeak = async (text: string, msgId: string) => {
    if (speakingId === msgId) return; // Already speaking
    setSpeakingId(msgId);

    // Cleanup previous context if any (simplified)
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    // Extract a summary or first paragraph for TTS to save tokens/time if text is huge
    const summaryText = text.length > 500 ? text.substring(0, 500) + "..." : text;

    const base64Audio = await GeminiService.generateNarrativeAudio(summaryText, subject.name);

    if (base64Audio && audioContextRef.current) {
      const buffer = await decodeAudioData(base64Audio, audioContextRef.current, 24000);
      playAudioBuffer(audioContextRef.current, buffer, () => setSpeakingId(null));
    } else {
      setSpeakingId(null);
      alert("Could not generate audio.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-6 shadow-sm ${msg.role === 'user'
              ? 'bg-[#BDB395] text-white rounded-br-none'
              : 'bg-[#F6F0F0] text-stone-800 rounded-bl-none border border-[#E5DCC3]'
              }`}>
              <div className="prose prose-sm prose-stone max-w-none">
                {/* Simple Markdown Rendering Replacement */}
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('##')) return <h3 key={i} className="font-bold text-lg mt-4 mb-2 text-[#5A5340]">{line.replace(/#/g, '')}</h3>;
                  if (line.startsWith('**')) return <strong key={i} className="block mt-2 font-bold">{line.replace(/\*\*/g, '')}</strong>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                  return <p key={i} className="mb-1 leading-relaxed">{line}</p>;
                })}
              </div>

              {msg.role === 'model' && (
                <div className="mt-4 pt-3 border-t border-[#D5C7A3]/30 flex justify-end">
                  <button
                    onClick={() => handleSpeak(msg.text, msg.id)}
                    disabled={speakingId !== null}
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition ${speakingId === msg.id ? 'bg-green-100 text-green-700 animate-pulse border border-green-200' : 'bg-white text-[#BDB395] hover:bg-[#FDFBF7] border border-[#E5DCC3]'}`}
                  >
                    <Icons.VolumeUp />
                    {speakingId === msg.id ? 'Playing...' : 'Explain (Voice)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#F6F0F0] p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
              <div className="w-2 h-2 bg-[#BDB395] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#BDB395] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[#BDB395] rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      <div className="mt-6 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter a topic (e.g., 'Pipelining', 'Fourier Series')..."
          className="w-full p-4 pr-16 rounded-xl border border-[#E7E5E4] focus:border-[#BDB395] focus:outline-none bg-white shadow-inner text-stone-700 placeholder-stone-400"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 bg-[#BDB395] text-white p-2 rounded-lg hover:bg-[#A39A7F] disabled:opacity-50 transition shadow-md"
        >
          <Icons.Send />
        </button>
      </div>
    </div>
  );
};

const QuizInterface = ({ subject }: { subject: Subject }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [topic, setTopic] = useState('');

  const startQuiz = async () => {
    setLoading(true);
    const qs = await GeminiService.generateQuiz(subject.name, topic);
    setQuestions(qs);
    setLoading(false);
    setStarted(true);
    setScore(0);
    setCurrentQIndex(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const correct = questions[currentQIndex].correctAnswer;
    if (option === correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BDB395] mb-4"></div>
        <p>Generating tailored questions for {subject.name}...</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="bg-[#F2E2B1] p-6 rounded-full mb-6 text-[#5A5340] shadow-md">
          <Icons.Settings />
        </div>
        <h2 className="text-3xl font-bold text-[#5A5340] mb-2">Ready to test your knowledge?</h2>
        <p className="text-stone-500 mb-8 max-w-md">Generate a quiz based on the entire syllabus or a specific topic.</p>

        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            className="input-field"
            placeholder="Enter specific topic (Optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={startQuiz} className="w-full py-3 text-lg">
            {topic ? `Generate Quiz on "${topic}"` : 'Generate Full Syllabus Quiz'}
          </Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-bold text-[#5A5340] mb-2">Quiz Complete!</h2>
        <p className="text-xl text-stone-600 mb-8">You scored <span className="font-bold text-[#BDB395] text-3xl">{score} / {questions.length}</span></p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setStarted(false)}>Back to Menu</Button>
          <Button onClick={startQuiz}>Try Another Quiz</Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-end">
        <span className="text-sm font-bold text-stone-400">Question {currentQIndex + 1} of {questions.length}</span>
        <span className="text-sm font-bold text-[#BDB395]">Score: {score}</span>
      </div>

      <div className="w-full bg-[#E7E5E4] h-2 rounded-full mb-8 overflow-hidden">
        <div className="bg-[#BDB395] h-full transition-all duration-500" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      <h3 className="text-2xl font-bold text-[#5A5340] mb-8 leading-relaxed">{currentQ.question}</h3>

      <div className="space-y-4">
        {currentQ.options.map((opt, idx) => {
          let stateClass = "border-[#E7E5E4] hover:bg-[#F6F0F0] text-stone-600 bg-white";
          if (selectedOption) {
            if (opt === currentQ.correctAnswer) stateClass = "bg-green-100 border-green-500 text-green-800";
            else if (opt === selectedOption) stateClass = "bg-red-100 border-red-500 text-red-800";
            else stateClass = "opacity-50 border-transparent";
          }

          return (
            <div
              key={idx}
              onClick={() => handleAnswer(opt)}
              className={`p-5 border rounded-xl cursor-pointer transition-all font-medium text-lg ${stateClass}`}
            >
              {opt}
            </div>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-8 p-6 bg-[#F2E2B1] border border-[#D5C7A3] rounded-xl text-[#5A5340] animate-fade-in">
          <strong className="block mb-2 text-[#5A5340]">Explanation:</strong> {currentQ.explanation}
        </div>
      )}
    </div>
  );
};