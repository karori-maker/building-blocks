import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface School {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  academic_year?: string;
  grading_system?: string;
}

interface SchoolContextType {
  schools: School[];
  currentSchool: School | null;
  setCurrentSchool: (school: School | null) => void;
  loading: boolean;
  refetch: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchool = () => {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within SchoolProvider');
  return ctx;
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    if (!user) { setSchools([]); setCurrentSchool(null); setLoading(false); return; }
    
    setLoading(true);
    const { data } = await supabase.from('schools').select('*').order('name');
    const list = (data || []) as School[];
    setSchools(list);
    
    // Auto-select first school if none selected
    if (list.length > 0 && !currentSchool) {
      setCurrentSchool(list[0]);
    } else if (list.length === 0) {
      setCurrentSchool(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && role) fetchSchools();
  }, [user, role]);

  return (
    <SchoolContext.Provider value={{ schools, currentSchool, setCurrentSchool, loading, refetch: fetchSchools }}>
      {children}
    </SchoolContext.Provider>
  );
};
