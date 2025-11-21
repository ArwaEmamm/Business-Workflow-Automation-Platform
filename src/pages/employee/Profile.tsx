import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const ProfilePage: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{user?.name ?? 'Unnamed User'}</h2>
          <div style={{ color: '#666' }}>{user?.email ?? 'No email'}</div>
        </div>
      </div>

      <section style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
        <h3>Account</h3>
        <p><strong>Role:</strong> {user?.role ?? '-'}</p>
  <p><strong>Member since:</strong> {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleString() : '-'}</p>
      </section>
    </div>
  );
};

export default ProfilePage;
