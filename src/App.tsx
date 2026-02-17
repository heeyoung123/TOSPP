import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { PrivacyPolicyGenerator } from '@/pages/PrivacyPolicyGenerator';
import { TermsOfServiceGenerator } from '@/pages/TermsOfServiceGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyGenerator />} />
        <Route path="/terms-of-service" element={<TermsOfServiceGenerator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
