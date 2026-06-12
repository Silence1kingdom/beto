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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminT } from '@/lib/admin-lang';
import { firestoreService, type ProjectData } from '@/lib/firebase-firestore';

interface Project extends ProjectData {
  id: string;
}

function loadLocal(): Project[] {
  try {
    const stored = localStorage.getItem('admin_projects');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [
    { id: '1', title: 'E-Commerce Platform', description: 'Full-stack online store with React and Node.js', tags: ['React', 'Node.js', 'MongoDB'], image: '' },
    { id: '2', title: 'AI Chat App', description: 'Real-time chat with AI-powered responses', tags: ['Python', 'AI', 'WebSocket'], image: '' },
    { id: '3', title: 'Portfolio Website', description: '3D interactive portfolio with Three.js', tags: ['Three.js', 'React', 'GSAP'], image: '' },
  ];
}

function saveLocal(projects: Project[]) {
  localStorage.setItem('admin_projects', JSON.stringify(projects));
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', tags: '', image: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const fb = await firestoreService.getProjects();
        if (fb.length > 0) {
          setProjects(fb.map((p) => ({ ...p, id: p.id! })));
          setLoading(false);
          return;
        }
      } catch {}
      setProjects(loadLocal());
      setLoading(false);
    };
    load();
  }, []);

  const persist = async (next: Project[]) => {
    setProjects(next);
    saveLocal(next);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', tags: '', image: '' });
    setEditingProject(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(', '),
      image: project.image,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (!form.title) return;

    if (editingProject) {
      const updated = { ...editingProject, title: form.title, description: form.description, tags, image: form.image };
      await firestoreService.updateProject(editingProject.id, updated);
      await persist(projects.map((p) => (p.id === editingProject.id ? updated : p)));
    } else {
      const fbId = await firestoreService.addProject({ title: form.title, description: form.description, tags, image: form.image });
      const created: Project = { id: fbId || String(Date.now()), title: form.title, description: form.description, tags, image: form.image };
      await persist([...projects, created]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(adminT('projects.deleteConfirm'))) return;
    await firestoreService.deleteProject(id);
    await persist(projects.filter((p) => p.id !== id));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-space text-3xl font-bold text-white">{adminT('projects.title')}</h1>
          <p className="mt-1 text-white/40">{adminT('projects.subtitle')}</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-electric-cyan text-void-black hover:bg-electric-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> {adminT('projects.add')}
        </Button>
      </div>

      <div className="rounded-xl border border-electric-cyan/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-electric-cyan/10">
              <TableHead className="text-white/60">{adminT('projects.tableTitle')}</TableHead>
              <TableHead className="text-white/60">{adminT('projects.tableDesc')}</TableHead>
              <TableHead className="text-white/60">{adminT('projects.tableTags')}</TableHead>
              <TableHead className="w-24 text-white/60">{adminT('projects.tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="border-electric-cyan/10 hover:bg-white/5">
                <TableCell className="font-medium text-white">{project.title}</TableCell>
                <TableCell className="text-white/60">{project.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-electric-cyan/20 text-electric-cyan">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(project)} className="h-8 w-8 text-white/40 hover:text-electric-cyan">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-8 w-8 text-white/40 hover:text-red-400">
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
              {editingProject ? adminT('projects.editTitle') : adminT('projects.addTitle')}
            </DialogTitle>
            <DialogDescription className="text-white/40">
              {editingProject ? adminT('projects.editDesc') : adminT('projects.addDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/70">{adminT('projects.titleLabel')}</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('projects.titlePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-white/70">{adminT('projects.descriptionLabel')}</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('projects.descriptionPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white/70">{adminT('projects.tagsLabel')}</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('projects.tagsPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-white/70">{adminT('projects.imageLabel')}</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="border-electric-cyan/20 bg-white/5 text-white"
                placeholder={adminT('projects.imagePlaceholder')}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-white/60 hover:text-white">
                {adminT('projects.cancel')}
              </Button>
              <Button onClick={handleSave} className="bg-electric-cyan text-void-black hover:bg-electric-cyan/90">
                {editingProject ? adminT('projects.update') : adminT('projects.createBtn')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
