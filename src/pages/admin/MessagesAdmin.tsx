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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Trash2, Eye, Mail } from 'lucide-react';
import { adminT } from '@/lib/admin-lang';
import { firestoreService, type MessageData } from '@/lib/firebase-firestore';

interface Message extends MessageData {
  id: string;
}

function loadLocal(): Message[] {
  try {
    return JSON.parse(localStorage.getItem('contact_messages') || '[]');
  } catch {
    return [];
  }
}

function saveLocal(messages: Message[]) {
  localStorage.setItem('contact_messages', JSON.stringify(messages));
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const fb = await firestoreService.getMessages();
        if (fb.length > 0) {
          setMessages(fb.map((m) => ({ ...m, id: m.id! })));
          setLoading(false);
          return;
        }
      } catch {}
      setMessages(loadLocal());
      setLoading(false);
    };
    load();
  }, []);

  const persist = async (next: Message[]) => {
    setMessages(next);
    saveLocal(next);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(adminT('messages.deleteConfirm'))) return;
    await firestoreService.deleteMessage(id);
    await persist(messages.filter((m) => m.id !== id));
  };

  const handleView = async (message: Message) => {
    if (!message.read) {
      await firestoreService.markMessageRead(message.id);
      await persist(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)));
    }
    setViewMessage({ ...message, read: true });
  };

  const unread = messages.filter((m) => !m.read).length;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-space text-3xl font-bold text-white">{adminT('messages.title')}</h1>
          <p className="mt-1 text-white/40">
            {adminT('messages.subtitle', { unread })}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-electric-cyan/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-electric-cyan/10">
              <TableHead className="text-white/60">{adminT('messages.tableFrom')}</TableHead>
              <TableHead className="text-white/60">{adminT('messages.tableSubject')}</TableHead>
              <TableHead className="text-white/60">{adminT('messages.tableDate')}</TableHead>
              <TableHead className="text-white/60">{adminT('messages.tableStatus')}</TableHead>
              <TableHead className="w-24 text-white/60">{adminT('messages.tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow
                key={msg.id}
                className={`border-electric-cyan/10 hover:bg-white/5 ${!msg.read ? 'bg-electric-cyan/5' : ''}`}
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{msg.name}</div>
                    <div className="text-xs text-white/40">{msg.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-white/80">{msg.subject}</TableCell>
                <TableCell className="text-white/40">{msg.date}</TableCell>
                <TableCell>
                  {msg.read ? (
                    <Badge variant="outline" className="border-white/10 text-white/40">
                      {adminT('messages.read')}
                    </Badge>
                  ) : (
                    <Badge className="bg-electric-cyan text-void-black">{adminT('messages.new')}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(msg)}
                      className="h-8 w-8 text-white/40 hover:text-electric-cyan"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(msg.id)}
                      className="h-8 w-8 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!viewMessage}
        onOpenChange={(open) => !open && setViewMessage(null)}
      >
        <DialogContent className="border-electric-cyan/10 bg-deep-navy text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5 text-electric-cyan" />
              {viewMessage?.subject}
            </DialogTitle>
            <DialogDescription className="text-white/40">
              {adminT('messages.from')}: {viewMessage?.name} ({viewMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-electric-cyan/10 bg-white/5 p-4">
            <p className="text-sm leading-relaxed text-white/80">{viewMessage?.message}</p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setViewMessage(null)}
              className="text-white/60 hover:text-white"
            >
              {adminT('messages.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
