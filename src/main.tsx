import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BooksProvider } from './context/BooksContext.tsx'
import { UsersProvider } from './context/UsersContext.tsx'
import Router from './Router.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BooksProvider>
      <UsersProvider>
        <Router />
      </UsersProvider>
    </BooksProvider>
  </StrictMode>,
)
