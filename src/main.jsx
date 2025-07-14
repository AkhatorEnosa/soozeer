import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AppProvider } from './context/AppContext.jsx'

const queryClient =  new QueryClient()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  </Provider>
)
