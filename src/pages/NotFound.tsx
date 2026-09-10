import { Link } from 'react-router-dom'
import { Card } from '../components/common/Card'

export function NotFound() {
  return (
    <main className="standalone-page d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <h1 className="visually-hidden">Page Not Found</h1>
            <Card title="404" subtitle="Page Not Found">
              <p className="text-muted-strong mb-4">
                The page you requested does not exist in this TeamFlow build.
              </p>
              <Link to="/dashboard" className="btn btn-primary btn-teamflow-primary">
                Back to Dashboard
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
