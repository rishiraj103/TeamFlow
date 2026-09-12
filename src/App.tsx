import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Card } from './components/common/Card'

function LayoutPreview() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xxl-9">
        <Card
          title="TeamFlow Application"
          subtitle="The application shell is ready for the feature pages that will arrive in later phases."
        >
          <p className="text-muted-strong mb-0">
            This temporary content is rendered inside the shared AppLayout outlet. The sidebar,
            topbar, and mobile navigation are now available to every nested route.
          </p>
        </Card>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppLayout
              pageTitle="Application shell"
              pageEyebrow="TeamFlow workspace"
              notificationCount={3}
            />
          }
        >
          <Route path="*" element={<LayoutPreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
