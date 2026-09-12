import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'

export function Login() {
  return (
    <main className="standalone-page d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-5">
            <Card title="Sign in to TeamFlow" subtitle="Authentication will be added in Phase 6.">
              <p className="text-muted-strong mb-4">
                This route is intentionally a placeholder for the future mock login flow.
              </p>
              <Link to="/dashboard" className="btn btn-primary btn-teamflow-primary">
                Continue to dashboard
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
