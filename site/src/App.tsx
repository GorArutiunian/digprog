import { Navigate, Route, Routes } from "react-router-dom";
import { MemberShell } from "./components/MemberShell";
import { Landing } from "./pages/Landing";
import { Checkout } from "./pages/Checkout";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Classroom } from "./pages/Classroom";
import { Tools } from "./pages/Tools";
import { Community } from "./pages/Community";
import { LiveEvents } from "./pages/LiveEvents";
import { Profile } from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/app" element={<MemberShell />}>
        <Route index element={<Dashboard />} />
        <Route path="classroom" element={<Classroom />} />
        <Route path="tools" element={<Tools />} />
        <Route path="community" element={<Community />} />
        <Route path="live" element={<LiveEvents />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
