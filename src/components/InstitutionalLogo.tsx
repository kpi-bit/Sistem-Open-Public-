import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 1. Official Institutional Logo with Deep Emerald Green & Rich Gold Nuances
export const InstitutionalLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs select-none"
        aria-label="Logo Resmi Universitas Al-Fithrah Surabaya"
      >
        <defs>
          <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="emeraldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring with Rich Gold & Emerald */}
        <circle cx="50" cy="50" r="47" fill="#fefdf9" stroke="url(#goldGrad1)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="#ffffff" stroke="#047857" strokeWidth="1" strokeDasharray="3 2" />

        {/* Central Arch / Shield Background */}
        <path
          d="M50 16 L76 26 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V26 Z"
          fill="url(#emeraldGrad1)"
          stroke="url(#goldGrad1)"
          strokeWidth="1.8"
        />

        {/* Dome Silhouette & Crescent Star */}
        <path
          d="M50 28 C44 28 41 33 41 37 C41 42 50 48 50 48 C50 48 59 42 59 37 C59 33 56 28 50 28 Z"
          fill="#fef3c7"
          stroke="#d4af37"
          strokeWidth="0.8"
        />
        {/* Crescent */}
        <path
          d="M49 22 C47 22 45 24 45 26.5 C45 29 47 31 49 31 C47.5 30.5 46.5 29 46.5 26.5 C46.5 24 47.5 22.5 49 22 Z"
          fill="#f59e0b"
        />
        <circle cx="51.5" cy="24.5" r="1.2" fill="#f59e0b" />

        {/* Open Book (Al-Qur'an / Kitab Ilmu) */}
        <path
          d="M50 50 C44 48 34 50 30 52 V66 C35 64 45 62 50 64 C55 62 65 64 70 66 V52 C66 50 56 48 50 50 Z"
          fill="#ffffff"
          stroke="url(#goldGrad1)"
          strokeWidth="1.5"
        />
        {/* Book Details */}
        <line x1="50" y1="50" x2="50" y2="64" stroke="#047857" strokeWidth="1.5" />
        <line x1="33" y1="56" x2="47" y2="54" stroke="#d4af37" strokeWidth="0.8" />
        <line x1="33" y1="60" x2="47" y2="58" stroke="#d4af37" strokeWidth="0.8" />
        <line x1="53" y1="54" x2="67" y2="56" stroke="#d4af37" strokeWidth="0.8" />
        <line x1="53" y1="58" x2="67" y2="60" stroke="#d4af37" strokeWidth="0.8" />

        {/* Small Ribbon / Banner */}
        <path
          d="M32 72 L50 68 L68 72 L64 76 L50 73 L36 76 Z"
          fill="url(#goldGrad1)"
        />
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fill="#064e3b"
          fontSize="4"
          fontWeight="bold"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          UAF
        </text>

        {/* Zenith Star */}
        <polygon points="50,11 51.5,14 55,14 52,16.5 53.5,20 50,17.5 46.5,20 48,16.5 45,14 48.5,14" fill="#d4af37" />
      </svg>
    </div>
  );
};

// 2. Exact Letterhead Golden Arch Outline Logo matching the Attached Sample
export const LetterheadKpiLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none shrink-0 ${className}`}>
      {/* Outer arched gold crest with golden contour matching the attachment */}
      <div className="w-16 h-16 relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="kopGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="innerDomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
          </defs>

          {/* Arched Outline in Rich Warm Gold */}
          <path
            d="M50 5 C26 5 14 22 14 46 V88 H86 V46 C86 22 74 5 50 5 Z"
            stroke="url(#kopGoldGrad)"
            strokeWidth="2.8"
            fill="#ffffff"
          />
          {/* Secondary Inner Golden Contour with fine dash line */}
          <path
            d="M50 11 C30 11 20 26 20 48 V82 H80 V48 C80 26 70 11 50 11 Z"
            stroke="#d4af37"
            strokeWidth="1.4"
            strokeDasharray="2.5 1.5"
          />

          {/* Central Dome / Mosque Silhouette */}
          <path
            d="M50 19 C42 19 37 26 37 32 C37 40 50 47 50 47 C50 47 63 40 63 32 C63 26 58 19 50 19 Z"
            stroke="#b8860b"
            strokeWidth="2"
            fill="url(#innerDomeGrad)"
          />

          {/* Crescent & Star at Zenith */}
          <circle cx="50" cy="15.5" r="2.2" fill="#c59b27" />

          {/* Open Book (Al-Qur'an / Kitab Ilmu) */}
          <path
            d="M50 49 C42 46 30 48 26 51 V67 C32 64 44 62 50 65 C56 62 68 64 74 67 V51 C70 48 58 46 50 49 Z"
            stroke="#b8860b"
            strokeWidth="2.2"
            fill="#ffffff"
          />
          {/* Spine of Book in Deep Green */}
          <line x1="50" y1="49" x2="50" y2="65" stroke="#047857" strokeWidth="2.2" />
          
          {/* Subtle Page Lines in Gold */}
          <line x1="30" y1="56" x2="46" y2="54" stroke="#d4af37" strokeWidth="1" />
          <line x1="30" y1="61" x2="46" y2="59" stroke="#d4af37" strokeWidth="1" />
          <line x1="54" y1="54" x2="70" y2="56" stroke="#d4af37" strokeWidth="1" />
          <line x1="54" y1="59" x2="70" y2="61" stroke="#d4af37" strokeWidth="1" />

          {/* Base Platform / Ribbons */}
          <path
            d="M26 75 L50 71 L74 75 L68 81 L50 77 L32 81 Z"
            fill="#fef3c7"
            stroke="#c59b27"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Caption text beneath the logo as in the official kop surat */}
      <div className="text-center mt-0.5 font-sans">
        <span className="text-[7.5px] font-extrabold tracking-tight text-slate-900 block leading-tight">
          UNIVERSITAS AL-FITHRAH (UAF)
        </span>
        <span className="text-[7.5px] font-bold tracking-wider text-amber-800 block leading-tight">
          SURABAYA
        </span>
      </div>
    </div>
  );
};

// 3. Official Stempel & Signature Block of Kaprodi KPI (Muhammad Munir, M.Sos.)
export const OfficialKpiStamp: React.FC<{
  dateStr?: string;
  className?: string;
}> = ({ dateStr, className = '' }) => {
  const currentDate = dateStr || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={`w-72 text-left font-sans text-xs relative select-none ${className}`}>
      <p className="text-slate-900 font-medium">Surabaya, {currentDate}</p>
      <p className="mt-0.5 text-slate-900 font-medium">Mengetahui,</p>
      <p className="font-bold text-slate-950 leading-snug">
        Kaprodi Komunikasi dan Penyiaran Islam
      </p>

      {/* Stempel & Signature Layer */}
      <div className="relative my-2 h-20 flex items-center">
        {/* Authentic Stempel Seal with curved text & gold-green emblem */}
        <div className="absolute -left-1 w-21 h-21 pointer-events-none opacity-90 select-none transform rotate-[-6deg]">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
            {/* Double Oval Rings in Institutional Dark Green & Gold */}
            <circle cx="50" cy="50" r="46" fill="#f0fdf4" fillOpacity="0.35" stroke="#047857" strokeWidth="2.4" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#d4af37" strokeWidth="1.1" strokeDasharray="3 1.5" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#047857" strokeWidth="1.4" />

            {/* Inner Crest Gold Outline */}
            <path
              d="M50 30 C44 30 40 35 40 40 C40 47 50 54 50 54 C50 54 60 47 60 40 C60 35 56 30 50 30 Z"
              stroke="#b8860b"
              strokeWidth="1.2"
              fill="#fef9e7"
            />
            {/* Open book inside seal */}
            <path
              d="M50 52 C44 50 36 51 34 53 V62 C38 60 46 59 50 61 C54 59 62 60 66 62 V53 C64 51 56 50 50 52 Z"
              stroke="#047857"
              strokeWidth="1.2"
              fill="#ffffff"
            />
            <line x1="50" y1="52" x2="50" y2="61" stroke="#b8860b" strokeWidth="1" />

            {/* Top Arc Text: UNIVERSITAS AL-FITHRAH SURABAYA */}
            <path id="topCurve" d="M 16 50 A 34 34 0 0 1 84 50" fill="none" />
            <text fontSize="6.2" fontWeight="bold" fill="#047857" letterSpacing="0.6">
              <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
                UNIVERSITAS AL-FITHRAH
              </textPath>
            </text>

            {/* Bottom Arc Text: KOMUNIKASI & PENYIARAN ISLAM */}
            <path id="bottomCurve" d="M 84 50 A 34 34 0 0 1 16 50" fill="none" />
            <text fontSize="5.5" fontWeight="bold" fill="#065f46" letterSpacing="0.4">
              <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
                KOMUNIKASI & PENYIARAN ISLAM
              </textPath>
            </text>

            {/* Stars on flanks */}
            <circle cx="16" cy="50" r="1.5" fill="#d4af37" />
            <circle cx="84" cy="50" r="1.5" fill="#d4af37" />
          </svg>
        </div>

        {/* Authentic Wet Ink Signature Representation */}
        <div className="ml-14 font-serif italic text-slate-900 text-xl font-bold select-none transform -rotate-3 z-10 opacity-95">
          <svg width="115" height="48" viewBox="0 0 115 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 35 C14 18 20 8 28 8 C34 8 36 28 38 34 C42 12 48 10 54 10 C62 10 65 30 70 30 C76 30 82 18 92 18 C98 18 104 26 110 28 M12 28 Q46 26 92 32"
              stroke="#0f172a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Kaprodi Name & NIDN */}
      <p className="font-bold underline text-slate-950 text-xs mt-1 tracking-tight">
        Muhammad Munir, M.Sos.
      </p>
      <p className="font-mono text-[11px] text-slate-700 font-semibold mt-0.5">
        NIDN. 2126059505
      </p>
    </div>
  );
};
