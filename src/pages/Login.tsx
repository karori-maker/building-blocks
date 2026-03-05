import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email.trim(), password);
    if (error) setError('Invalid email or password');
    else navigate('/');
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success('Password reset link sent to your email');
    setResetLoading(false);
    setShowForgot(false);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-2"><GraduationCap className="w-8 h-8" /></div>
            <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          </div>
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-lg">Forgot Password</CardTitle><CardDescription>Enter your email to receive a reset link</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required placeholder="you@school.com" /></div>
                <Button type="submit" className="w-full" disabled={resetLoading}>{resetLoading ? 'Sending...' : 'Send Reset Link'}</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>Back to Login</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-2"><GraduationCap className="w-8 h-8" /></div>
          <h1 className="text-2xl font-bold tracking-tight">Westfield Academy</h1>
          <p className="text-muted-foreground text-sm">School Management System</p>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter the credentials provided by your administrator</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.com" required autoComplete="email" /></div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" /></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
              <Button type="button" variant="link" className="w-full text-sm" onClick={() => setShowForgot(true)}>Forgot your password?</Button>
            </form>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>Protected by role-based access control. Contact your admin for access.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
