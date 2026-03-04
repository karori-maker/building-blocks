import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'admin' | 'teacher' | 'student' | 'parent' | 'sub_admin';

interface RoleSectionProps {
  roles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders children only if the current user's role is in the allowed roles list.
 *  sub_admin is treated as admin for UI visibility (data scoping is handled by RLS). */
const RoleSection = ({ roles, children, fallback = null }: RoleSectionProps) => {
  const { role } = useAuth();
  if (!role) return <>{fallback}</>;
  // sub_admin gets same UI access as admin
  const effectiveRole = role === 'sub_admin' ? 'admin' : role;
  if (!roles.includes(effectiveRole as AppRole)) return <>{fallback}</>;
  return <>{children}</>;
};

export default RoleSection;
