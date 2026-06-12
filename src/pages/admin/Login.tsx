import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminT } from '@/lib/admin-lang';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(adminT('login.error'));
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password);
      if (result) {
        navigate('/admin');
      } else {
        setError(adminT('login.errorCredentials'));
      }
    } catch {
      setError(adminT('login.errorCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void-black p-4" style={{ cursor: 'auto' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-electric-cyan text-2xl font-bold text-void-black">
            B
          </div>
          <h1 className="font-space text-2xl font-bold text-white">{adminT('login.title')}</h1>
          <p className="mt-1 text-sm text-white/40">{adminT('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/70">{adminT('login.username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-electric-cyan/20 bg-white/5 text-white placeholder:text-white/30"
              placeholder={adminT('login.usernamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">{adminT('login.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-electric-cyan/20 bg-white/5 text-white placeholder:text-white/30"
              placeholder={adminT('login.passwordPlaceholder')}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-electric-cyan text-void-black hover:bg-electric-cyan/90 disabled:opacity-50"
          >
            {loading ? adminT('login.signIn') + '...' : adminT('login.signIn')}
          </Button>
        </form>
      </div>
    </div>
  );
}
