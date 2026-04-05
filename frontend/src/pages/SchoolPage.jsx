import PageNav from '../components/layout/PageNav.jsx'

function SchoolPage({ selectedSchool, userName, onGoToDashboard, onGoBackToSearch, onLogout }) {
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
        <div className="profile-header school-header">
          <div className="profile-avatar school-page-logo">
            {selectedSchool.logo || selectedSchool.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{selectedSchool.name}</h1>
            <p className="profile-headline">{selectedSchool.type}</p>
            <p className="profile-location">📍 {selectedSchool.location}</p>
            <p className="profile-followers">
              👥{' '}
              {selectedSchool.followers >= 1000000
                ? (selectedSchool.followers / 1000000).toFixed(1) + 'M'
                : (selectedSchool.followers / 1000).toFixed(0) + 'K'}{' '}
              followers
            </p>
            <div className="company-actions">
              <button className="follow-btn">+ Follow</button>
              <a
                href={selectedSchool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="website-btn"
              >
                Visit website
              </a>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <h3>📋 About</h3>
            <p className="company-description">{selectedSchool.description}</p>
          </section>

          <section className="profile-section">
            <h3>🎓 School Details</h3>
            <div className="company-details-grid">
              <div className="detail-item">
                <span className="detail-label">Founded</span>
                <span className="detail-value">{selectedSchool.founded}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type</span>
                <span className="detail-value">{selectedSchool.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{selectedSchool.location}</span>
              </div>
            </div>
          </section>

          {selectedSchool.programs?.length > 0 && (
            <section className="profile-section">
              <h3>📚 Programs</h3>
              <div className="skills-list">
                {selectedSchool.programs.map((program) => (
                  <span key={program} className="skill-chip">
                    {program}
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

export default SchoolPage
