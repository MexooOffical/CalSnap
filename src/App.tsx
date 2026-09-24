import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const genders = ['Male', 'Female', 'Other'] as const;

type Gender = (typeof genders)[number];

export default function App() {
  const [selectedGender, setSelectedGender] = useState<Gender>('Female');

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="topbar">
          <div className="brand-pill">screensdesign</div>
          <div className="status-block" aria-hidden="true">
            <span className="status-dot" />
            <span className="status-dot" />
            <span className="status-dot" />
          </div>
        </header>

        <main className="screen-body">
          <div className="top-controls">
            <button className="back-button" aria-label="Back">
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
            <div className="progress-line" aria-label="Progress line">
              <span />
            </div>
          </div>

          <section className="content">
            <h1>Choose your Gender</h1>
            <p>This will be used to calibrate your custom plan.</p>
          </section>

          <div className="gender-list" role="radiogroup" aria-label="Gender options">
            {genders.map((gender) => (
              <button
                key={gender}
                type="button"
                role="radio"
                aria-checked={selectedGender === gender}
                className={`gender-option ${selectedGender === gender ? 'selected' : ''}`}
                onClick={() => setSelectedGender(gender)}
              >
                {gender}
              </button>
            ))}
          </div>

          <div className="submit-wrap">
            <button type="button" className="continue-button">
              Continue
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
