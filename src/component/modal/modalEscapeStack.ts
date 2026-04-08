type StackEntry = {
  id: number
  close: () => void
}

const stack: StackEntry[] = []
let nextId = 0
let listening = false

function onDocumentKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  const top = stack[stack.length - 1]
  if (!top) return
  event.preventDefault()
  event.stopPropagation()
  top.close()
}

function ensureListener() {
  if (listening) return
  window.addEventListener('keydown', onDocumentKeyDown, true)
  listening = true
}

function teardownListenerIfIdle() {
  if (stack.length === 0 && listening) {
    window.removeEventListener('keydown', onDocumentKeyDown, true)
    listening = false
  }
}

/** 后注册的 Modal 视为最顶层，Esc 只触发栈顶 close */
export function registerModalEscapeClose(close: () => void): () => void {
  const id = nextId++
  stack.push({ id, close })
  ensureListener()
  return () => {
    const i = stack.findIndex((e) => e.id === id)
    if (i >= 0) stack.splice(i, 1)
    teardownListenerIfIdle()
  }
}
