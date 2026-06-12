import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminT } from '@/lib/admin-lang';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirm) {
      setError(adminT('register.errorRequired'));
      return;
    }
    if (password.length < 6) {
      setError(adminT('register.errorLength'));
      return;
    }
    if (password !== confirm) {
      setError(adminT('register.errorMatch'));
      return;
    }

    setLoading(true);
    try {
      const result = await register(username, password);
      if (result) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/login'), 1500);
      } else {
        setError(adminT('register.errorExists'));
      }
    } catch {
      setError(adminT('register.errorExists'));
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
          <h1 className="font-space text-2xl font-bold text-white">{adminT('register.title')}</h1>
          <p className="mt-1 text-sm text-white/40">{adminT('register.subtitle')}</p>
        </div>

        {success ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-green-400 font-medium">{adminT('register.success')}</p>
            <p className="text-white/40 text-sm mt-1">{adminT('register.redirect')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/70">{adminT('register.username')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-electric-cyan/20 bg-white/5 text-white placeholder:text-white/30"
                placeholder={adminT('register.usernamePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">{adminT('register.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-electric-cyan/20 bg-white/5 text-white placeholder:text-white/30"
                placeholder={adminT('register.passwordPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-white/70">{adminT('register.confirm')}</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="border-electric-cyan/20 bg-white/5 text-white placeholder:text-white/30"
                placeholder={adminT('register.confirmPlaceholder')}
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
              {loading ? adminT('register.create') + '...' : adminT('register.create')}
            </Button>

            <p className="text-center text-sm text-white/30">
              {adminT('register.hasAccount')}{' '}
              <Link to="/admin/login" className="text-electric-cyan hover:underline">
                {adminT('register.signIn')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
