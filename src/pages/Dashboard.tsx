import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import ParentDashboard from '@/components/dashboards/ParentDashboard';

const Dashboard = () => {
  const { role } = useAuth();

  switch (role) {
    case 'admin':
    case 'sub_admin':
      return <AdminDashboard />;
    case 'teacher': return <TeacherDashboard />;
    case 'student': return <StudentDashboard />;
    case 'parent': return <ParentDashboard />;
    default: return <div className="text-center py-8 text-muted-foreground">Loading dashboard...</div>;
  }
};

export default Dashboard;
