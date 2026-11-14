import { useEffect, useState } from 'react'

const STORAGE_KEY = 'todo-react-tasks'

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* localStorage nav pieejams */
    }
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks([{ id: Date.now(), title, done: false }, ...tasks])
    setText('')
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id) {
    // dinamisks elements: uzdevums vispirms izzūd ar animāciju
    setRemoving(id)
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setRemoving(null)
    }, 250)
  }

  function clearDone() {
    setTasks(tasks.filter((t) => !t.done))
  }

  const visible = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  )
  const doneCount = tasks.filter((t) => t.done).length
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <main className="app">
      <h1>Uzdevumu saraksts</h1>

      <form className="add" onSubmit={addTask}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Jauns uzdevums..."
          aria-label="Jauns uzdevums"
        />
        <button type="submit">Pievienot</button>
      </form>

      <div className="progress" aria-label="Progress">
        <div className="bar" style={{ width: `${percent}%` }} />
      </div>
      <p className="stats">
        Izpildīts: {doneCount} no {tasks.length} ({percent}%)
      </p>

      <div className="filters">
        {[
          ['all', 'Visi'],
          ['active', 'Aktīvie'],
          ['done', 'Izpildītie'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? 'active' : ''}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="list">
        {visible.map((t) => (
          <li
            key={t.id}
            className={`${t.done ? 'done' : ''} ${removing === t.id ? 'removing' : ''}`}
          >
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
              />
              <span>{t.title}</span>
            </label>
            <button
              className="delete"
              onClick={() => deleteTask(t.id)}
              aria-label={`Dzēst: ${t.title}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p className="empty">Nav uzdevumu.</p>}

      {doneCount > 0 && (
        <button className="clear" onClick={clearDone}>
          Dzēst izpildītos
        </button>
      )}
    </main>
  )
}
