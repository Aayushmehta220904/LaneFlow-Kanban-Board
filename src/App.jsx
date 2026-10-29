import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'laneflow.tasks.v1'
const UI_KEY = 'laneflow.ui.v1'

const columns = [
  { id: 'todo', title: 'Todo', hint: 'Ready to start' },
  { id: 'progress', title: 'In Progress', hint: 'Currently moving' },
  { id: 'completed', title: 'Completed', hint: 'Finished work' },
]

const priorities = ['Low', 'Medium', 'High']

const starterTasks = [
  {
    id: 'lf-01',
    title: 'Prepare Git follow-up answers',
    description: 'Revise revert vs reset, cherry-pick, rebase, .gitignore and interactive rebase.',
    priority: 'High',
    dueDate: '2026-10-30',
    status: 'progress',
    createdAt: 1761739000000,
  },
  {
    id: 'lf-02',
    title: 'Solve LeetCode 217 and 242',
    description: 'Take accepted-result screenshots immediately after submission.',
    priority: 'High',
    dueDate: '2026-10-29',
    status: 'todo',
    createdAt: 1761738000000,
  },
  {
    id: 'lf-03',
    title: 'Review React useEffect cases',
    description: 'Focus on dependencies, cleanup and StrictMode behaviour.',
    priority: 'Medium',
    dueDate: '2026-10-30',
    status: 'todo',
    createdAt: 1761737000000,
  },
  {
    id: 'lf-04',
    title: 'Set up deployment checklist',
    description: 'Verify GitHub, Vercel, Drive folder permissions and demo video.',
    priority: 'Low',
    dueDate: '2026-10-31',
    status: 'completed',
    createdAt: 1761736000000,
  },
]

function safeLoadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return starterTasks
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : starterTasks
  } catch {
    return starterTasks
  }
}

function safeLoadUI() {
  try {
    const raw = localStorage.getItem(UI_KEY)
    return raw ? JSON.parse(raw) : { compact: false }
  } catch {
    return { compact: false }
  }
}

function Icon({ name, size = 18 }) {
  const paths = {
    plus: <><path d="M12 5v14M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></>,
    x: <><path d="M6 6l12 12M18 6 6 18"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    refresh: <><path d="M20 6v5h-5"/><path d="M19 11a8 8 0 1 0 2 5"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    spark: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z"/><path d="m19 15 .7 1.8L21.5 18l-1.8.7L19 20.5l-.7-1.8-1.8-.7 1.8-.7Z"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function formatDueDate(date) {
  if (!date) return 'No due date'
  const d = new Date(`${date}T00:00:00`)
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(d)
}

function isOverdue(task) {
  if (!task.dueDate || task.status === 'completed') return false
  const today = new Date()
  today.setHours(0,0,0,0)
  return new Date(`${task.dueDate}T00:00:00`) < today
}

function TaskCard({ task, onEdit, onDelete, onMove, compact, onDragStart }) {
  const overdue = isOverdue(task)
  return (
    <article
      className={`task-card ${compact ? 'compact' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="task-card-top">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        <div className="task-actions">
          <button className="icon-btn" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><Icon name="edit" size={15}/></button>
          <button className="icon-btn danger" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}><Icon name="trash" size={15}/></button>
        </div>
      </div>

      <div className="task-copy">
        <h3>{task.title}</h3>
        {!compact && <p>{task.description || 'No description added.'}</p>}
      </div>

      <div className="task-card-bottom">
        <span className={`due ${overdue ? 'overdue' : ''}`}>
          <Icon name="calendar" size={14}/>
          {overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
        </span>
        <select className="move-select" value={task.status} onChange={(e) => onMove(task.id, e.target.value)} aria-label={`Move ${task.title}`}>
          <option value="todo">Todo</option>
          <option value="progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </article>
  )
}

function TaskDrawer({ open, editing, defaultStatus, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', status: defaultStatus || 'todo' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description,
        priority: editing.priority,
        dueDate: editing.dueDate,
        status: editing.status,
      })
    } else {
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '', status: defaultStatus || 'todo' })
    }
  }, [open, editing, defaultStatus])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (form.title.trim().length < 3) nextErrors.title = 'Use at least 3 characters.'
    if (!form.description.trim()) nextErrors.description = 'Description is required.'
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <div>
            <span className="micro-label">{editing ? 'EDIT TASK' : 'NEW TASK'}</span>
            <h2>{editing ? 'Update task' : 'Create a task'}</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close"><Icon name="x"/></button>
        </header>

        <form onSubmit={submit} className="task-form">
          <label>
            <span>Title</span>
            <input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Ship landing page" />
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>

          <label>
            <span>Description</span>
            <textarea rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What needs to happen?" />
            {errors.description && <small className="field-error">{errors.description}</small>}
          </label>

          <div className="form-row">
            <label>
              <span>Priority</span>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {priorities.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <label>
            <span>Due date</span>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            {errors.dueDate && <small className="field-error">{errors.dueDate}</small>}
          </label>

          <div className="drawer-footer">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{editing ? 'Save changes' : 'Create task'}</button>
          </div>
        </form>
      </aside>
    </div>
  )
}

function EmptyColumn({ filtered, onAdd }) {
  return (
    <div className="empty-column">
      <div className="empty-symbol"><Icon name={filtered ? 'filter' : 'plus'} size={18}/></div>
      <strong>{filtered ? 'No matching tasks' : 'No tasks here yet'}</strong>
      <span>{filtered ? 'Adjust search or filters.' : 'Add a task to get started.'}</span>
      {!filtered && <button onClick={onAdd}>Add task</button>}
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(safeLoadTasks)
  const [ui, setUI] = useState(safeLoadUI)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('todo')
  const [toast, setToast] = useState('')
  const [dragOver, setDragOver] = useState(null)

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)), [tasks])
  useEffect(() => localStorage.setItem(UI_KEY, JSON.stringify(ui)), [ui])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(id)
  }, [toast])

  const filteredTasks = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const searchMatch = !needle || task.title.toLowerCase().includes(needle)
      const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter
      const statusMatch = statusFilter === 'All' || task.status === statusFilter
      return searchMatch && priorityMatch && statusMatch
    })
  }, [tasks, search, priorityFilter, statusFilter])

  const counts = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks])

  const completion = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0
  const hasFilters = Boolean(search.trim()) || priorityFilter !== 'All' || statusFilter !== 'All'

  const openAdd = (status = 'todo') => {
    setEditing(null)
    setDefaultStatus(status)
    setDrawerOpen(true)
  }

  const openEdit = (task) => {
    setEditing(task)
    setDefaultStatus(task.status)
    setDrawerOpen(true)
  }

  const saveTask = (form) => {
    if (editing) {
      setTasks(current => current.map(task => task.id === editing.id ? { ...task, ...form } : task))
      setToast('Task updated')
    } else {
      setTasks(current => [{ id: `task-${Date.now()}`, createdAt: Date.now(), ...form }, ...current])
      setToast('Task created')
    }
    setDrawerOpen(false)
    setEditing(null)
  }

  const deleteTask = (task) => {
    if (!window.confirm(`Delete “${task.title}”?`)) return
    setTasks(current => current.filter(item => item.id !== task.id))
    setToast('Task deleted')
  }

  const moveTask = (id, status) => {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task))
  }

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const dropTask = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) {
      moveTask(id, status)
      setToast(`Moved to ${columns.find(c => c.id === status)?.title}`)
    }
    setDragOver(null)
  }

  const resetDemo = () => {
    if (!window.confirm('Restore the starter tasks and clear your current board?')) return
    setTasks(starterTasks)
    setSearch('')
    setPriorityFilter('All')
    setStatusFilter('All')
    setToast('Starter board restored')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="logo-mark"><span></span><span></span><span></span></div>
          <div><strong>LaneFlow</strong><small>Kanban workspace</small></div>
        </div>

        <div className="sidebar-nav">
          <button className="side-link active"><Icon name="grid"/><span>Board</span><kbd>B</kbd></button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>
          <div className="workspace-card">
            <span className="workspace-dot"></span>
            <div><strong>Weekly Sprint</strong><small>Interview Prep · Sheet 02</small></div>
          </div>
        </div>

        <div className="sidebar-stats">
          <div><span>Completion</span><strong>{completion}%</strong></div>
          <div className="mini-progress"><span style={{ width: `${completion}%` }}></span></div>
          <small>{counts.completed} of {counts.total} tasks completed</small>
        </div>

        <div className="sidebar-bottom">
          <button className="side-link" onClick={resetDemo}><Icon name="refresh"/><span>Restore demo</span></button>
          <div className="profile-chip"><div className="avatar">AM</div><div><strong>Aayush</strong><small>Student workspace</small></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={13}/><strong>Weekly Sprint</strong></div>
            <h1>Kanban Task Board</h1>
          </div>
          <div className="topbar-actions">
            <button className="view-toggle" onClick={() => setUI(current => ({ ...current, compact: !current.compact }))} title="Toggle card density">
              <span className={ui.compact ? '' : 'active'}>Comfort</span><span className={ui.compact ? 'active' : ''}>Compact</span>
            </button>
            <button className="btn primary" onClick={() => openAdd('todo')}><Icon name="plus" size={16}/>Add task</button>
          </div>
        </header>

        <section className="summary-strip">
          <div className="summary-primary">
            <span className="micro-label">THIS SPRINT</span>
            <strong>{completion}% complete</strong>
            <div className="summary-progress"><span style={{ width: `${completion}%` }}></span></div>
          </div>
          <div className="metric"><span>Total</span><strong>{counts.total}</strong></div>
          <div className="metric"><span>In progress</span><strong>{counts.progress}</strong></div>
          <div className="metric"><span>Completed</span><strong>{counts.completed}</strong></div>
          <div className={`metric ${counts.overdue ? 'warn' : ''}`}><span>Overdue</span><strong>{counts.overdue}</strong></div>
        </section>

        <section className="toolbar">
          <div className="search-box">
            <Icon name="search" size={17}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks by title..." aria-label="Search tasks"/>
            {search && <button onClick={() => setSearch('')} aria-label="Clear search"><Icon name="x" size={14}/></button>}
          </div>
          <div className="filters">
            <span className="filter-label"><Icon name="filter" size={15}/>Filters</span>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Filter by priority">
              <option>All</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
              <option>All</option><option value="todo">Todo</option><option value="progress">In Progress</option><option value="completed">Completed</option>
            </select>
            {hasFilters && <button className="clear-filter" onClick={() => { setSearch(''); setPriorityFilter('All'); setStatusFilter('All') }}>Clear</button>}
          </div>
        </section>

        <section className="board" aria-label="Kanban board">
          {columns.map(column => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id)
            const totalInColumn = tasks.filter(task => task.status === column.id).length
            return (
              <div
                key={column.id}
                className={`column ${dragOver === column.id ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(column.id) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => dropTask(e, column.id)}
              >
                <div className="column-head">
                  <div className="column-title">
                    <span className={`status-dot ${column.id}`}></span>
                    <div><strong>{column.title}</strong><small>{column.hint}</small></div>
                  </div>
                  <div className="column-tools"><span className="count-badge">{hasFilters ? columnTasks.length : totalInColumn}</span><button className="icon-btn" onClick={() => openAdd(column.id)} aria-label={`Add task to ${column.title}`}><Icon name="plus" size={15}/></button></div>
                </div>

                <div className="column-body">
                  {columnTasks.length ? columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={deleteTask} onMove={moveTask} compact={ui.compact} onDragStart={onDragStart}/>
                  )) : <EmptyColumn filtered={hasFilters} onAdd={() => openAdd(column.id)}/>} 
                </div>
              </div>
            )
          })}
        </section>

        <footer className="footer">
          <span>LaneFlow · Sheet 02 Machine Coding</span>
          <span>Drag tasks between columns or use the status selector on mobile.</span>
        </footer>
      </main>

      <TaskDrawer open={drawerOpen} editing={editing} defaultStatus={defaultStatus} onClose={() => { setDrawerOpen(false); setEditing(null) }} onSave={saveTask}/>
      {toast && <div className="toast"><span><Icon name="check" size={15}/></span>{toast}</div>}
    </div>
  )
}
