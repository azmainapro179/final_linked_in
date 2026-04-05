import PageNav from '../components/layout/PageNav.jsx'

function CompanyPage({
  selectedCompany,
  userName,
  followedCompanyIds,
  onGoToDashboard,
  onGoBackToSearch,
  onLogout,
  onFollowCompany,
  onUnfollowCompany,
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
        <div className="profile-header company-header">
          <div className="profile-avatar company-page-logo">
            {selectedCompany.logo || selectedCompany.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{selectedCompany.name}</h1>
            <p className="profile-headline">{selectedCompany.industry}</p>
            <p className="profile-location">📍 {selectedCompany.location}</p>
            <p className="profile-followers">
              👥 {(selectedCompany.followers / 1000000).toFixed(1)}M followers ·{' '}
              {selectedCompany.employeeCount} employees
            </p>
            <div className="company-actions">
              {followedCompanyIds.includes(selectedCompany.id) ? (
                <button
                  className="follow-btn network-following-btn"
                  onClick={() => onUnfollowCompany(selectedCompany.id)}
                >
                  Following
                </button>
              ) : (
                <button className="follow-btn" onClick={() => onFollowCompany(selectedCompany.id)}>
                  + Follow
                </button>
              )}
              <a
                href={selectedCompany.website}
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
            <p className="company-description">{selectedCompany.description}</p>
          </section>

          <section className="profile-section">
            <h3>🏢 Company Details</h3>
            <div className="company-details-grid">
              <div className="detail-item">
                <span className="detail-label">Founded</span>
                <span className="detail-value">{selectedCompany.founded}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Industry</span>
                <span className="detail-value">{selectedCompany.industry}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Company Size</span>
                <span className="detail-value">{selectedCompany.employeeCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Headquarters</span>
                <span className="detail-value">{selectedCompany.location}</span>
              </div>
            </div>
          </section>

          {selectedCompany.specialties?.length > 0 && (
            <section className="profile-section">
              <h3>🎯 Specialties</h3>
              <div className="skills-list">
                {selectedCompany.specialties.map((specialty) => (
                  <span key={specialty} className="skill-chip">
                    {specialty}
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

export default CompanyPage
