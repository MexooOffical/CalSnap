import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const genders = ['Male', 'Female', 'Other'] as const;
type Gender = (typeof genders)[number];

function StatusBar() {
  return (
    <div className="status-bar" aria-label="Phone status bar">
      <div className="brand-pill">screens<span>design</span></div>
      <div className="status-icons" aria-hidden="true">
        <div className="signal"><i /><i /><i /><i /></div>
        <div className="wifi"><b /><b /><b /></div>
        <div className="battery"><div /></div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedGender, setSelectedGender] = useState<Gender>('Female');
  const [step, setStep] = useState(1);

  const continueFlow = () => setStep((current) => Math.min(current + 1, 10));
  const goBack = () => setStep((current) => Math.max(current - 1, 1));

  return (
    <div className="app-background">
      <main className="phone-screen">
        <StatusBar />

        <section className="onboarding-content">
          <div className="navigation-row">
            <button className="back-button" onClick={goBack} aria-label="Go back">
              <ArrowLeft size={56} strokeWidth={1.8} />
            </button>
            <div className="progress-track" aria-label={`Step ${step} of 10`}>
              <div className="progress-value" style={{ width: `${step * 10}%` }} />
            </div>
          </div>

          <header className="intro-copy">
            <h1>Choose your Gender</h1>
            <p>This will be used to calibrate your custom plan.</p>
          </header>

          <div className="gender-options" role="radiogroup" aria-label="Choose your gender">
            {genders.map((gender) => (
              <button
                key={gender}
                className={`gender-option ${selectedGender === gender ? 'selected' : ''}`}
                onClick={() => setSelectedGender(gender)}
                role="radio"
                aria-checked={selectedGender === gender}
              >
                {gender}
              </button>
            ))}
          </div>
        </section>

        <div className="continue-wrap">
          <button className="continue-button" onClick={continueFlow}>
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
