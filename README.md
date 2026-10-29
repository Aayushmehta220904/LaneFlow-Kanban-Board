# LaneFlow — Kanban Task Board

LaneFlow is a responsive frontend Kanban board built for **Interview Preparation Sheet 02 — Machine Coding**.

## Required functionality covered

- Three columns: **Todo**, **In Progress**, **Completed**
- Add task with **title, description, priority and due date**
- Edit task
- Delete task
- Move tasks between columns
  - desktop drag and drop
  - status selector for mobile/accessibility
- Search tasks by title
- Filter by priority
- Filter by status
- LocalStorage persistence
- Responsive desktop/tablet/mobile layout
- Empty-column state
- No-results state when filters match nothing
- Basic form validation
- Clean component/state architecture

## Extra polish

- Completion metrics and sprint progress
- Overdue task indicator
- Compact/comfort card density toggle
- Starter demo tasks
- Restore-demo action
- Toast feedback
- Keyboard-accessible form controls
- Reduced-motion support

## Tech stack

- React 18
- Vite
- CSS
- Browser LocalStorage
- Native HTML5 drag-and-drop

No backend is required for this assignment.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## State management

`App.jsx` owns the task list, search/filter state, drawer state and UI preference. Task data is the main source of truth. Summary metrics and column counts are derived from the current task array.

## LocalStorage

Tasks are stored at:

```text
laneflow.tasks.v1
```

UI preference is stored at:

```text
laneflow.ui.v1
```

This keeps the board state after page refresh without requiring a backend.

## CRUD mapping

- **Create:** Add Task button / column plus button
- **Read:** Kanban columns
- **Update:** Edit drawer, status selector, drag-and-drop
- **Delete:** Delete icon with confirmation

## Deployment

Recommended: Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Submission

WorkDir requires:

1. GitHub Repository URL
2. Live URL
3. Drive URL
4. Notes (optional)

The Drive folder should include the required DSA proof screenshots and can also contain the demo video if desired.
