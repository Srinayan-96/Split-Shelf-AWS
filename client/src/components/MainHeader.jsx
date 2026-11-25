import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import PersonName from './PersonName';
import ProfilePictureModal from './ProfilePictureModal';

export default function MainHeader({ title, subtitle, onOpenMenu }) {
  const { user, updateUser } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <header className="main-header">
      <div className="main-header-left">
        {onOpenMenu && (
          <button
            className="menu-drawer-btn"
            onClick={onOpenMenu}
            aria-label="Open sidebar navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className="title-subtitle-block">
          <h1 className="main-title">{title}</h1>
          {subtitle && <p className="main-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="main-header-right">
        <NotificationBell />
        <div className="user-chip-container" title="Click to change profile picture">
          <PersonName
            id={user.id}
            name={user.name}
            avatarUrl={user.avatarUrl}
            onClick={() => setShowAvatarModal(true)}
          />
        </div>
        <ThemeToggle />
      </div>

      {showAvatarModal && (
        <ProfilePictureModal
          user={user}
          onClose={() => setShowAvatarModal(false)}
          onUpdated={(updated) => updateUser(updated)}
        />
      )}
    </header>
  );
}


