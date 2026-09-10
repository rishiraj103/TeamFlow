import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Input } from '../components/common/Input'
import { DEMO_CREDENTIALS } from '../constants/auth'
import { useAuth } from '../context/useAuth'

interface LoginFieldErrors {
  email?: string
  password?: string
}

function validateLogin(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [submitError, setSubmitError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(undefined)

    const errors = validateLogin(email, password)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    const result = login(email, password)
    setIsSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="standalone-page auth-page d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-5">
            <h1 className="visually-hidden">Sign in to TeamFlow</h1>
            <div className="auth-page__branding">
              <span className="sidebar__brand-mark" aria-hidden="true">
                T
              </span>
              <span>TeamFlow</span>
            </div>
            <Card title="Sign in to TeamFlow" subtitle="Use the demo account to continue.">
              <form noValidate onSubmit={handleSubmit}>
                {submitError ? (
                  <div className="alert alert-danger" role="alert">
                    {submitError}
                  </div>
                ) : null}

                <div className="vstack gap-3">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setSubmitError(undefined)
                    }}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    error={fieldErrors.email}
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setSubmitError(undefined)
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    error={fieldErrors.password}
                  />
                  <Button type="submit" className="w-100" isLoading={isSubmitting}>
                    Sign in
                  </Button>
                </div>
              </form>

              <div className="auth-page__demo-note alert alert-info mt-4 mb-0" role="note">
                <strong>Demo account</strong>
                <span>Email: {DEMO_CREDENTIALS.email}</span>
                <span>Password: {DEMO_CREDENTIALS.password}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
