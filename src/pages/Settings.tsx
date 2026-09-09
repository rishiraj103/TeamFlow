import { Card } from '../components/common/Card'
import { useNotificationPreferences } from '../context/useNotificationPreferences'
import { useTheme } from '../context/useTheme'
import type { NotificationPreferences, ThemeMode } from '../types'

interface NotificationSetting {
  key: keyof NotificationPreferences
  label: string
  description: string
}

const themeOptions: Array<{ value: ThemeMode; label: string; description: string }> = [
  {
    value: 'light',
    label: 'Light',
    description: 'Use the bright TeamFlow workspace theme.',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use a darker theme for lower-light environments.',
  },
]

const notificationSettings: NotificationSetting[] = [
  {
    key: 'taskDeadlines',
    label: 'Task deadline notifications',
    description: 'Get notified when an assigned task is approaching its due date.',
  },
  {
    key: 'projectUpdates',
    label: 'Project update notifications',
    description: 'Get notified when a project you belong to changes.',
  },
  {
    key: 'activityUpdates',
    label: 'Activity notifications',
    description: 'Get notified about meaningful activity across the workspace.',
  },
]

interface PreferenceToggleProps {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function PreferenceToggle({ id, label, description, checked, onChange }: PreferenceToggleProps) {
  return (
    <div className="settings-preference">
      <div className="settings-preference__copy">
        <label htmlFor={id} className="settings-preference__label">
          {label}
        </label>
        <p id={`${id}-description`} className="settings-preference__description">
          {description}
        </p>
      </div>
      <div className="form-check form-switch settings-preference__control">
        <input
          id={id}
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={`${id}-description`}
        />
      </div>
    </div>
  )
}

export function Settings() {
  const { currentTheme, setTheme } = useTheme()
  const { notificationPreferences, updateNotificationPreferences } = useNotificationPreferences()

  return (
    <div className="settings-page">
      <header className="settings-page__header mb-4">
        <p className="section-kicker">Workspace preferences</p>
        <h2 className="settings-page__title">Settings</h2>
        <p className="settings-page__description">
          Customize how TeamFlow looks and which workspace updates you receive.
        </p>
      </header>

      <div className="settings-page__grid">
        <Card
          title="Appearance"
          subtitle="Choose the theme used across the entire application."
          className="settings-card"
        >
          <fieldset className="settings-theme-options">
            <legend className="settings-fieldset__legend">Color theme</legend>
            <div className="settings-theme-options__grid">
              {themeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`settings-theme-option${currentTheme === option.value ? ' is-selected' : ''}`}
                >
                  <input
                    className="settings-theme-option__input"
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={currentTheme === option.value}
                    onChange={() => setTheme(option.value)}
                  />
                  <span className="settings-theme-option__copy">
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Card>

        <Card
          title="Notifications"
          subtitle="Choose which workspace updates should be enabled."
          className="settings-card"
        >
          <div className="settings-preferences">
            {notificationSettings.map((setting) => (
              <PreferenceToggle
                key={setting.key}
                id={`notification-${setting.key}`}
                label={setting.label}
                description={setting.description}
                checked={notificationPreferences[setting.key]}
                onChange={(checked) => updateNotificationPreferences({ [setting.key]: checked })}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
