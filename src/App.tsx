import { useState } from 'react'
import { Badge, type BadgeVariant } from './components/common/Badge'
import { Button, type ButtonVariant } from './components/common/Button'
import { Card } from './components/common/Card'
import { EmptyState } from './components/common/EmptyState'
import { Input } from './components/common/Input'
import { Modal } from './components/common/Modal'
import { Select, type SelectOption } from './components/common/Select'
import { Spinner } from './components/common/Spinner'

const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'outline', 'ghost']
const badgeVariants: BadgeVariant[] = [
  'active',
  'completed',
  'archived',
  'todo',
  'in-progress',
  'low',
  'medium',
  'high',
]
const selectOptions: SelectOption[] = [
  { label: 'Design system', value: 'design-system' },
  { label: 'Application shell', value: 'application-shell' },
]

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [inputValue, setInputValue] = useState('')

  return (
    <main className="app-shell">
      <div className="container py-5">
        <header className="app-shell__content mb-5">
          <p className="app-shell__eyebrow">Reusable UI primitives</p>
          <h1 className="app-shell__title">TeamFlow common components</h1>
          <p className="app-shell__description">
            A small showcase for the accessible components future TeamFlow pages will share.
          </p>
        </header>

        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Card
              title="Actions and labels"
              subtitle="Buttons and badges centralize interaction and status styling."
              headerAction={
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Open modal
                </Button>
              }
            >
              <div className="u-stack">
                <div>
                  <p className="section-kicker">Button variants</p>
                  <div className="d-flex flex-wrap gap-2">
                    {buttonVariants.map((variant) => (
                      <Button key={variant} variant={variant}>
                        {variant}
                      </Button>
                    ))}
                    <Button isLoading>Loading</Button>
                    <Button disabled variant="secondary">
                      Disabled
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="section-kicker">Badge variants</p>
                  <div className="d-flex flex-wrap gap-2">
                    {badgeVariants.map((variant) => (
                      <Badge key={variant} variant={variant} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 col-xl-5">
            <Card
              title="Form controls"
              subtitle="Labels, values, options, and errors are explicit."
            >
              <div className="u-stack">
                <Input
                  label="Example input"
                  name="example-input"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Type anything"
                  required
                  helperText="This helper text is connected with aria-describedby."
                  error="Example validation message is visible and announced."
                />
                <Select
                  label="Example select"
                  name="example-select"
                  value={selectedOption}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  options={selectOptions}
                  required
                />
              </div>
            </Card>
          </div>

          <div className="col-12 col-lg-5">
            <Card title="Loading indicators" subtitle="Bootstrap spinners with consistent sizing.">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <div className="u-stack align-items-center gap-2">
                  <Spinner size="small" />
                  <span className="small text-muted-strong">Small</span>
                </div>
                <div className="u-stack align-items-center gap-2">
                  <Spinner size="medium" />
                  <span className="small text-muted-strong">Medium</span>
                </div>
                <div className="u-stack align-items-center gap-2">
                  <Spinner size="large" />
                  <span className="small text-muted-strong">Large</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 col-lg-7">
            <EmptyState
              title="No component data yet"
              description="This reusable empty state can explain an empty project, task, team, or analytics view."
              icon="＋"
              action={
                <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                  Show modal example
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title="Reusable modal"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="mb-0">
          This generic modal supports close, Escape, focus management, and confirm/cancel actions.
        </p>
      </Modal>
    </main>
  )
}

export default App
