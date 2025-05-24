import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import AppRoutes from './routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { MessageProvider } from './context/MessageContext.jsx';
import { LoaderProvider } from './context/LoaderContext';
import FullScreenLoader from './components/FullScreenLoader';
import { useLoader } from './context/LoaderContext';
import { QueryProvider } from './context/QueryProvider.jsx'

const queryClient = new QueryClient();

function LoaderOverlay() {
  const { loading } = useLoader();
  return <FullScreenLoader open={loading} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoaderProvider>
        <MessageProvider>
          <AlertProvider>
            <AuthProvider>
              <QueryProvider>
              <AppRoutes />
              <LoaderOverlay />
              </QueryProvider>
            </AuthProvider>
          </AlertProvider>
        </MessageProvider>
      </LoaderProvider>
    </QueryClientProvider>
  </StrictMode>,
)
