
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-sm">
      <path
        d="M50 85C50 85 10 60 10 35C10 20 25 10 40 22C45 26 50 32 50 32C50 32 55 26 60 22C75 10 90 20 90 35C90 60 50 85 50 85Z"
        fill="#fbcfe8"
        stroke="#db2777"
        strokeWidth="2"
      />
      <path
        d="M50 70C50 70 25 55 25 40C25 30 35 25 43 32C47 35 50 38 50 38C50 38 53 35 57 32C65 25 75 30 75 40C75 55 50 70 50 70Z"
        fill="#fdf2f8"
        stroke="#db2777"
        strokeWidth="1.5"
      />
    </svg>
    <span className="font-bold text-xl text-black tracking-tight">
      the <span className="text-pink-500">fourth</span> trimester
    </span>
  </div>
);

export default Logo;
