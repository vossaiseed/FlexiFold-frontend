import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Guards nested routes. Requires a logged-in user (token in auth state) and,
// when `allowedRoles` is given, that the user's role is one of them.
// Usage in routes:
//   <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
//     <Route path="/partner" element={<PartnerLayout />}> ... </Route>
//   </Route>
export default function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useSelector((store) => store.auth);

  // Not signed in → go to login. If the token is httpOnly we can't read it
  // from JavaScript, so also allow a persisted `user` as a fallback.
  const isAuthenticated = token || user;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Signed in but not allowed in this area → send to their own dashboard
  // (or login if we can't determine their role).
  const role = user?.user_metadata?.role;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role ? `/${role}/dashboard` : "/login"} replace />;
  }

  // Authorized → render the nested route.
  return <Outlet />;
}
