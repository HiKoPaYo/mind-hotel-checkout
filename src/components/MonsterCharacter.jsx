import React from 'react';

export const MONSTER_SHAPES = [
  { id: 'cloud', name: '먹구름형', icon: '☁️' },
  { id: 'slime', name: '슬라임형', icon: '💧' },
  { id: 'furry', name: '털복숭이형', icon: '🧶' },
  { id: 'horn', name: '도깨비형', icon: '😈' },
  { id: 'spiky', name: '뾰족가시형', icon: '⚡' },
];

export const MONSTER_COLORS = [
  { id: 'purple', name: '불안 보라', hex: '#8b5cf6', dark: '#6d28d9' },
  { id: 'blue', name: '우울 파랑', hex: '#3b82f6', dark: '#1d4ed8' },
  { id: 'red', name: '분노 빨강', hex: '#ef4444', dark: '#b91c1c' },
  { id: 'orange', name: '긴장 주황', hex: '#f97316', dark: '#c2410c' },
  { id: 'green', name: '눈치 초록', hex: '#10b981', dark: '#047857' },
  { id: 'gray', name: '먹구름 잿빛', hex: '#64748b', dark: '#334155' },
  { id: 'pink', name: '민망 분홍', hex: '#ec4899', dark: '#be185d' },
];

export const MONSTER_EYES = [
  { id: 'glare', name: '째려봄' },
  { id: 'smug', name: '심술' },
  { id: 'dizzy', name: '뱅글뱅글' },
  { id: 'sad', name: '뾰로통' },
  { id: 'scary', name: '으스스' },
];

export const MONSTER_MOUTHS = [
  { id: 'zigzag', name: '지그재그' },
  { id: 'tongue', name: '메롱' },
  { id: 'frown', name: '시무룩' },
  { id: 'teeth', name: '이빨' },
  { id: 'open', name: '헤벌레' },
];

export default function MonsterCharacter({
  config = {},
  size = 180,
  isPoked = false,
  isScared = false,
  isFrozen = false,
  balloonScale = 1,
  ballMode = false,
  className = '',
  onClick,
}) {
  const shape = config.shape || 'slime';
  const colorObj = MONSTER_COLORS.find(c => c.id === config.color) || MONSTER_COLORS[0];
  const eyes = config.eyes || 'smug';
  const mouth = config.mouth || 'zigzag';
  const fillColor = isFrozen ? '#93c5fd' : colorObj.hex;
  const strokeColor = isFrozen ? '#3b82f6' : colorObj.dark;

  // Body paths
  const renderBody = () => {
    if (ballMode) {
      // 축구공 모드
      return (
        <g>
          <circle cx="100" cy="100" r="75" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          <polygon points="100,60 120,75 112,95 88,95 80,75" fill={strokeColor} opacity="0.4" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
        </g>
      );
    }

    switch (shape) {
      case 'cloud':
        return (
          <path
            d="M 50 120 
               A 35 35 0 0 1 70 65 
               A 45 45 0 0 1 135 60 
               A 35 35 0 0 1 160 115 
               A 30 30 0 0 1 140 150 
               L 60 150 
               A 30 30 0 0 1 50 120 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        );
      case 'horn':
        return (
          <g>
            {/* Horns */}
            <path d="M 60 65 Q 45 35 30 45 Q 50 65 65 75 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
            <path d="M 140 65 Q 155 35 170 45 Q 150 65 135 75 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
            {/* Body */}
            <ellipse cx="100" cy="115" rx="65" ry="60" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          </g>
        );
      case 'furry':
        return (
          <path
            d="M 100 40 
               Q 120 42 135 50 Q 150 45 160 65 Q 175 75 170 95 Q 180 115 170 135 Q 165 155 145 160 Q 125 170 100 168 Q 75 170 55 160 Q 35 155 30 135 Q 20 115 30 95 Q 25 75 40 65 Q 50 45 65 50 Q 80 42 100 40 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        );
      case 'spiky':
        return (
          <polygon
            points="100,35 120,60 155,50 145,80 175,95 145,115 165,145 130,140 120,170 100,150 80,170 70,140 35,145 55,115 25,95 55,80 45,50 80,60"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        );
      case 'slime':
      default:
        return (
          <path
            d="M 100 45 
               C 150 45 165 95 165 125 
               C 165 155 140 165 100 165 
               C 60 165 35 155 35 125 
               C 35 95 50 45 100 45 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        );
    }
  };

  // Eyes rendering
  const renderEyes = () => {
    if (isScared) {
      return (
        <g>
          <circle cx="75" cy="95" r="14" fill="#fff" stroke="#1e293b" strokeWidth="3" />
          <circle cx="75" cy="95" r="5" fill="#1e293b" />
          <circle cx="125" cy="95" r="14" fill="#fff" stroke="#1e293b" strokeWidth="3" />
          <circle cx="125" cy="95" r="5" fill="#1e293b" />
          {/* Sweat drop */}
          <path d="M 150 80 Q 155 90 150 95 Q 145 90 150 80 Z" fill="#60a5fa" />
        </g>
      );
    }

    switch (eyes) {
      case 'dizzy':
        return (
          <g stroke="#1e293b" strokeWidth="4" strokeLinecap="round">
            {/* Spiral 1 */}
            <path d="M 70 95 L 85 105 M 85 95 L 70 105" />
            {/* Spiral 2 */}
            <path d="M 115 95 L 130 105 M 130 95 L 115 105" />
          </g>
        );
      case 'smug':
        return (
          <g>
            <circle cx="75" cy="100" r="12" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="78" cy="98" r="6" fill="#1e293b" />
            <circle cx="125" cy="100" r="12" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="128" cy="98" r="6" fill="#1e293b" />
            {/* Smug eyebrows */}
            <path d="M 65 85 Q 75 80 88 88" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 112 88 Q 125 80 135 85" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'glare':
        return (
          <g>
            <path d="M 65 92 Q 80 82 90 92 Q 80 105 65 92 Z" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="78" cy="93" r="5" fill="#dc2626" />
            <path d="M 135 92 Q 120 82 110 92 Q 120 105 135 92 Z" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="122" cy="93" r="5" fill="#dc2626" />
            {/* Fierce eyebrows */}
            <line x1="62" y1="83" x2="90" y2="90" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <line x1="138" y1="83" x2="110" y2="90" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'sad':
        return (
          <g>
            <circle cx="75" cy="102" r="10" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="75" cy="104" r="5" fill="#1e293b" />
            <circle cx="125" cy="102" r="10" fill="#fff" stroke="#1e293b" strokeWidth="3" />
            <circle cx="125" cy="104" r="5" fill="#1e293b" />
            {/* Sad eyebrows */}
            <path d="M 65 88 Q 75 92 85 86" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 115 86 Q 125 92 135 88" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'scary':
      default:
        return (
          <g>
            <circle cx="75" cy="98" r="13" fill="#fef08a" stroke="#1e293b" strokeWidth="3" />
            <ellipse cx="75" cy="98" rx="3" ry="8" fill="#1e293b" />
            <circle cx="125" cy="98" r="13" fill="#fef08a" stroke="#1e293b" strokeWidth="3" />
            <ellipse cx="125" cy="98" rx="3" ry="8" fill="#1e293b" />
          </g>
        );
    }
  };

  // Mouth rendering
  const renderMouth = () => {
    if (isScared) {
      return (
        <ellipse cx="100" cy="132" rx="12" ry="16" fill="#1e293b" stroke="#fff" strokeWidth="2" />
      );
    }

    switch (mouth) {
      case 'zigzag':
        return (
          <path
            d="M 80 130 L 88 138 L 96 128 L 104 138 L 112 128 L 120 136"
            stroke="#1e293b"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'tongue':
        return (
          <g>
            <path d="M 82 126 Q 100 135 118 126" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 94 130 C 94 148 108 148 108 130 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="2" />
          </g>
        );
      case 'teeth':
        return (
          <g>
            <rect x="80" y="124" width="40" height="14" rx="4" fill="#1e293b" />
            <polygon points="85,124 90,132 95,124" fill="#fff" />
            <polygon points="98,124 103,132 108,124" fill="#fff" />
            <polygon points="108,138 113,130 118,138" fill="#fff" />
          </g>
        );
      case 'open':
        return (
          <path
            d="M 82 125 Q 100 155 118 125 Z"
            fill="#1e293b"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        );
      case 'frown':
      default:
        return (
          <path
            d="M 80 135 Q 100 120 120 135"
            stroke="#1e293b"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  };

  // Cheek blush
  const renderCheeks = () => (
    <g fill="#f43f5e" opacity="0.4">
      <circle cx="62" cy="115" r="7" />
      <circle cx="138" cy="115" r="7" />
    </g>
  );

  // Ice overlay if frozen
  const renderFrozenOverlay = () => {
    if (!isFrozen) return null;
    return (
      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d="M 50 70 L 65 85 M 65 70 L 50 85" />
        <path d="M 140 120 L 155 135 M 155 120 L 140 135" />
        <path d="M 90 40 L 100 55 L 110 40" fill="none" />
        {/* Ice crystals */}
        <polygon points="95,160 100,145 105,160" fill="#bae6fd" />
      </g>
    );
  };

  const transformStyle = {
    transform: `scale(${balloonScale}) ${isPoked ? 'scale(1.15, 0.85)' : ''}`,
    transition: 'transform 0.15s ease-out',
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        style={transformStyle}
        className="w-full h-full drop-shadow-lg filter transition-all duration-150"
      >
        {renderBody()}
        {renderCheeks()}
        {renderEyes()}
        {renderMouth()}
        {renderFrozenOverlay()}
      </svg>
    </div>
  );
}
