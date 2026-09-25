import { Bell, ChevronLeft, ChevronRight, EllipsisVertical, Footprints, Home, LineChart, ScanLine, UserRound, Utensils, Waves, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import './index.css';

type NavKey = 'home' | 'progress' | 'activity' | 'profile';

const ingredients = [
  { name: 'Avocado', kcal: 200, color: 'tomato' },
  { name: 'Bread', kcal: 150, color: 'blue' },
  { name: 'Olive oil', kcal: 80, color: 'lime' },
];

const navItems: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'progress', label: 'Progress', icon: LineChart },
  { key: 'activity', label: 'Activity', icon: Footprints },
  { key: 'profile', label: 'Profile', icon: UserRound },
];

function NotificationButton() {
  return <button className="icon-button notification" aria-label="Notifications"><Bell size={19} strokeWidth={1.8} /><span /></button>;
}

function Header() {
  return <header className="header"><div><p className="eyebrow">Good morning <span aria-hidden="true">👋</span></p><h1>Alex Jemison</h1></div><NotificationButton /></header>;
}

function DateSelector() {
  const [offset, setOffset] = useState(0);
  const days = useMemo(() => {
    const base = new Date(2025, 10, 12 + offset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base); date.setDate(base.getDate() + index);
      return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), date: date.getDate() };
    });
  }, [offset]);
  return <section className="date-card" aria-label="Choose a date">
    <div className="date-heading"><h2>November 2025</h2><div className="date-arrows"><button onClick={() => setOffset((value) => value - 1)} aria-label="Previous days"><ChevronLeft size={17} /></button><button onClick={() => setOffset((value) => value + 1)} aria-label="Next days"><ChevronRight size={17} /></button></div></div>
    <div className="calendar-row">{days.map((item, index) => <button className={`calendar-day ${index === 2 ? 'selected' : ''}`} key={`${item.day}-${item.date}`} aria-label={`${item.day} ${item.date}`}><span>{item.day}</span><strong>{item.date}</strong></button>)}</div>
  </section>;
}

function CalorieProgress() {
  return <div className="calorie-progress" aria-label="456 of 512 calories consumed"><span /></div>;
}

function MealCard() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <section className="meal-card">
    <div className="meal-heading"><h2>Breakfast</h2><div className="menu-wrap"><button className="more-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Breakfast options"><EllipsisVertical size={20} /></button>{menuOpen && <div className="action-menu"><button>Edit meal</button><button>Remove meal</button></div>}</div></div>
    <div className="calories"><strong>456</strong><span>/ 512 kcal</span></div>
    <CalorieProgress />
    <p className="ingredient-label">3 ingredients</p>
    <div className="ingredient-list">{ingredients.map((ingredient) => <div className="ingredient" key={ingredient.name}><span>{ingredient.name}</span><i className={`ingredient-line ${ingredient.color}`} /><strong>{ingredient.kcal} <small>kcal</small></strong></div>)}</div>
  </section>;
}

function ActivityCard({ title, value, unit, type }: { title: string; value: string; unit: string; type: 'steps' | 'water' }) {
  return <article className="activity-card"><div className="activity-top"><p>{title.split(' ').map((word) => <span key={word}>{word}</span>)}</p>{type === 'steps' ? <Footprints size={18} strokeWidth={1.8} /> : <Waves size={19} strokeWidth={1.8} />}</div><strong>{value}</strong><small>{unit}</small></article>;
}

function FloatingScanButton({ onClick }: { onClick: () => void }) {
  return <button className="scan-button" onClick={onClick} aria-label="Scan food"><ScanLine size={24} strokeWidth={1.7} /></button>;
}

function BottomNavigation({ active, onChange }: { active: NavKey; onChange: (key: NavKey) => void }) {
  return <nav className="bottom-nav" aria-label="Main navigation">{navItems.map(({ key, label, icon: Icon }) => <button key={key} className={active === key ? 'active' : ''} onClick={() => onChange(key)} aria-label={label}><span><Icon size={19} strokeWidth={active === key ? 2.1 : 1.8} /></span></button>)}</nav>;
}

function ScanModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="scan-title"><div className="scan-modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="scan-icon"><ScanLine size={31} /></div><h2 id="scan-title">Scan Food</h2><p>Take a photo of your meal and CalSnap AI will estimate its nutrition.</p><button className="primary-button" onClick={onClose}>Open camera</button></div></div>;
}

function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="placeholder-page"><div className="placeholder-mark"><Utensils size={23} /></div><h2>{title}</h2><p>{subtitle}</p></div>;
}

function AppShell() {
  const [active, setActive] = useState<NavKey>('home');
  const [scanOpen, setScanOpen] = useState(false);
  return <div className="app-shell"><main className="app-content">
    {active === 'home' ? <><Header /><DateSelector /><MealCard /><div className="activity-grid"><ActivityCard title="Step to walk" value="5,234" unit="step" type="steps" /><ActivityCard title="Drink water" value="12" unit="glass" type="water" /></div></> : <PlaceholderPage title={navItems.find((item) => item.key === active)?.label ?? ''} subtitle="A clearer view of your nutrition journey is coming soon." />}
    </main><FloatingScanButton onClick={() => setScanOpen(true)} /><BottomNavigation active={active} onChange={setActive} />{scanOpen && <ScanModal onClose={() => setScanOpen(false)} />}</div>;
}

export default AppShell;
