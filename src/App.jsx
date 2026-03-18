import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import AdSpendPage from './pages/AdSpendPage.jsx'
import ChannelDetailPage from './pages/ChannelDetailPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { TenantProvider } from './context/TenantContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/ad-spend"
              element={
                <PrivateRoute>
                  <AdSpendPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/channels/:channel"
              element={
                <PrivateRoute>
                  <ChannelDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/:sku"
              element={
                <PrivateRoute>
                  <ProductDetailPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  )
}

export default App
