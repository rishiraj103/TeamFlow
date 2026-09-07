export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  initials: string
}

export interface AuthState {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
}
