import PageNav from '../components/layout/PageNav.jsx'

function UserProfilePage({
  selectedUser,
  userId,
  userName,
  connected,
  pending,
  invited,
  onGoToDashboard,
  onGoBackToSearch,
  onLogout,
  onRemoveConnection,
  onCancelInvite,
  onAcceptInvite,
  onRejectInvite,
  onConnect,
}) {
  return (
    <div className="page profile-view-page">
      <div className="halo" />
      <div className="grid-accent" />

      <PageNav
        userName={userName}
        onBrandClick={onGoToDashboard}
        onBack={onGoBackToSearch}
        onLogout={onLogout}
      />

      <div className="profile-view-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {selectedUser.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{selectedUser.fullName}</h1>
            <p className="profile-headline">{selectedUser.headline}</p>
            <p className="profile-email">{selectedUser.email}</p>
          </div>
          {selectedUser.id === userId ? null : connected.includes(selectedUser.id) ? (
            <>
              <button
                className="connected-btn"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                connected
              </button>
              <button
                className="remove-connection-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveConnection(userId, selectedUser.id)
                }}
              >
                remove connection
              </button>
            </>
          ) : pending.includes(selectedUser.id) ? (
            <button
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation()
                onCancelInvite(userId, selectedUser.id)
              }}
            >
              cancel invite
            </button>
          ) : invited.includes(selectedUser.id) ? (
            <>
              <button
                className="accept-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onAcceptInvite(userId, selectedUser.id)
                }}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRejectInvite(userId, selectedUser.id)
                }}
              >
                Reject
              </button>
            </>
          ) : (
            <button
              className="view-btn"
              onClick={(e) => {
                e.stopPropagation()
                onConnect(userId, selectedUser.id)
              }}
            >
              Connect+
            </button>
          )}
        </div>

        <div className="profile-sections">
          {selectedUser.profile?.workHistory?.length > 0 && (
            <section className="profile-section">
              <h3>💼 Work Experience</h3>
              <div className="section-items">
                {selectedUser.profile.workHistory.map((work, idx) => (
                  <div key={idx} className="work-item">
                    <h4>{work.title}</h4>
                    <p className="company">{work.company}</p>
                    <p className="duration">
                      {work.start} - {work.current ? 'Present' : work.end}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedUser.profile?.education?.length > 0 && (
            <section className="profile-section">
              <h3>🎓 Education</h3>
              <div className="section-items">
                {selectedUser.profile.education.map((edu, idx) => (
                  <div key={idx} className="edu-item">
                    <h4>{edu.school}</h4>
                    <p>
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedUser.profile?.skills?.length > 0 && (
            <section className="profile-section">
              <h3>🛠️ Skills</h3>
              <div className="skills-list">
                {selectedUser.profile.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {selectedUser.profile?.interests?.length > 0 && (
            <section className="profile-section">
              <h3>💡 Interests</h3>
              <div className="interests-list">
                {selectedUser.profile.interests.map((interest) => (
                  <span key={interest} className="interest-chip">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
