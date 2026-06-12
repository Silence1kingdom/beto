import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminT } from '@/lib/admin-lang';
import { firestoreService, type TeamMemberData } from '@/lib/firebase-firestore';

interface Member extends TeamMemberData {
  id: string;
}

function loadLocal(): Member[] {
  try {
    const stored = localStorage.getItem('admin_team_members');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [
    { id: '1', name: 'Ahmed Hassan', role: 'Lead Developer', avatar: '' },
    { id: '2', name: 'Sara Mohamed', role: 'UI/UX Designer', avatar: '' },
    { id: '3', name: 'Karim Ali', role: 'Project Manager', avatar: '' },
  ];
}

function saveLocal(members: Member[]) {
  localStorage.setItem('admin_team_members', JSON.stringify(members));
}

export default function TeamAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: '', role: '', avatar: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const fb = await firestoreService.getTeamMembers();
        if (fb.length > 0) {
          setMembers(fb.map((m) => ({ ...m, id: m.id! })));
          setLoading(false);
          return;
        }
      } catch {}
      setMembers(loadLocal());
      setLoading(false);
    };
    load();
  }, []);

  const persist = async (next: Member[]) => {
    setMembers(next);
    saveLocal(next);
  };

  const resetForm = () => {
    setForm({ name: '', role: '', avatar: '' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditing(member);
    setForm({ name: member.name, role: member.role, avatar: member.avatar });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) return;

    if (editing) {
      const updated = { ...editing, name: form.name, role: form.role, avatar: form.avatar };
      await firestoreService.updateTeamMember(editing.id, updated);
      await persist(members.map((m) => (m.id === editing.id ? updated : m)));
    } else {
      const fbId = await firestoreService.addTeamMember({ name: form.name, role: form.role, avatar: form.avatar });
      const created: Member = { id: fbId || String(Date.now()), name: form.name, role: form.role, avatar: form.avatar };
      await persist([...members, created]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(adminT('team.deleteConfirm'))) return;
    await firestoreService.deleteTeamMember(id);
    await persist(members.filter((m) => m.id !== id));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-space text-3xl font-bold text-white">{adminT('team.title')}</h1>
          <p className="mt-1 text-white/40">{adminT('team.subtitle')}</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-electric-cyan text-void-black hover:bg-electric-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> {adminT('team.add')}
        </Button>
      </div>

      <div className="rounded-xl border border-electric-cyan/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-electric-cyan/10">
              <TableHead className="text-white/60">{adminT('team.tableName')}</TableHead>
              <TableHead className="text-white/60">{adminT('team.tableRole')}</TableHead>
              <TableHead className="w-24 text-white/60">{adminT('team.tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="border-electric-cyan/10 hover:bg-white/5">
                <TableCell className="font-medium text-white">{member.name}</TableCell>
                <TableCell className="text-white/60">{member.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(member)} className="h-8 w-8 text-white/40 hover:text-electric-cyan">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="h-8 w-8 text-white/40 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-electric-cyan/10 bg-deep-navy text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing ? adminT('team.editTitle') : adminT('team.addTitle')}
            </DialogTitle>
            <DialogDescription className="text-white/40">
              {editing ? adminT('team.editDesc') : adminT('team.addDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">{adminT('team.nameLabel')}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('team.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white/70">{adminT('team.roleLabel')}</Label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('team.rolePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-white/70">{adminT('team.avatarLabel')}</Label>
              <Input
                id="avatar"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('team.avatarPlaceholder')}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-white/60 hover:text-white">
                {adminT('team.cancel')}
              </Button>
              <Button onClick={handleSave} className="bg-electric-cyan text-void-black hover:bg-electric-cyan/90">
                {editing ? adminT('team.update') : adminT('team.addBtn')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
