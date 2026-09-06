function App() {
  return (
    <main className="app-shell d-flex align-items-center">
      <div className="container py-5">
        <div className="app-shell__content">
          <section className="tf-card">
            <header className="tf-card__header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <p className="app-shell__eyebrow">Design system foundation</p>
                <h1 className="app-shell__title">TeamFlow</h1>
                <p className="app-shell__description">
                  Bootstrap utilities and reusable TeamFlow SCSS are ready for the next phase.
                </p>
              </div>
              <span className="status-badge status-badge--active">Ready</span>
            </header>

            <div className="tf-card__body">
              <div className="row g-4">
                <div className="col-12 col-md-7">
                  <p className="section-kicker">Reusable foundations</p>
                  <h2 className="tf-card__title">A consistent visual language</h2>
                  <p className="text-muted-strong mb-4">
                    Spacing, typography, buttons, cards, forms, badges, and breakpoints now share
                    the same SCSS tokens.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-primary btn-teamflow-primary">
                      Primary action
                    </button>
                    <button type="button" className="btn btn-teamflow-ghost">
                      Secondary action
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-5">
                  <div className="demo-panel">
                    <p className="section-kicker">Form styling</p>
                    <label htmlFor="design-system-input" className="form-label">
                      Example field
                    </label>
                    <input
                      id="design-system-input"
                      type="text"
                      className="form-control"
                      placeholder="Ready for reusable forms"
                    />
                    <div className="form-text">Bootstrap form classes with TeamFlow styling.</div>
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <span className="priority-badge priority-badge--high">High priority</span>
                      <span className="priority-badge priority-badge--low">Low priority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="tf-card__footer d-flex flex-wrap align-items-center gap-2">
              <span className="badge text-bg-primary">Bootstrap utility</span>
              <span className="status-badge status-badge--completed">Custom SCSS</span>
              <span className="small text-body-secondary">
                Uses container, grid, spacing, flex, and gap utilities.
              </span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
