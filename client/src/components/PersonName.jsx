import { Link } from 'react-router-dom';
import { hueIndex } from '../utils/memberColor';

export default function PersonName({ id, name, href, suffix, avatarUrl, onClick }) {
  const label = name || 'Member';
  const initial = label.trim().charAt(0).toUpperCase() || '?';
  const body = (
    <span
      className="person"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="avatar avatar-img"
          style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span className="avatar" data-hue={hueIndex(id || label)} aria-hidden="true">{initial}</span>
      )}
      <span>{label}{suffix}</span>
    </span>
  );
  if (!href) return body;
  return <Link to={href} className="person-link">{body}</Link>;
}
