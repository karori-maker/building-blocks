import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'admin' | 'teacher' | 'student' | 'parent';

interface RoleSectionProps {
  roles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders children only if the current user's role is in the allowed roles list */
const RoleSection = ({ roles, children, fallback = null }: RoleSectionProps) => {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
};

export default RoleSection;
