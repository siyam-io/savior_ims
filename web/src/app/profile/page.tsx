'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQueryClient } from '@tanstack/react-query';
import { User, Camera, Shield, Mail, Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setName(u.name || '');
      setEmail(u.email);
      setProfileImage(u.profileImage || '');
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload/image', formData);
      setProfileImage(data.url);
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload: any = { name, profileImage };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await api.put('/users/profile', payload);
      
      const updatedUser = { ...user, name, profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      queryClient.invalidateQueries();
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <div className="absolute -bottom-12 left-8 p-1 bg-card rounded-3xl shadow-xl">
            <div className="relative group">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-card transition-transform group-hover:scale-[1.02]">
                <AvatarImage src={profileImage} className="object-cover" />
                <AvatarFallback className="rounded-2xl bg-muted text-2xl font-black uppercase">
                  {name?.[0] || email?.[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-2xl transition-opacity">
                <Camera className="w-8 h-8" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">My Profile</h1>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-primary" /> System Access & Personal Details
              </p>
            </div>
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-muted-foreground/10">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Personal Information</span>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50">Full Name</Label>
                  <Input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="h-12 rounded-2xl bg-background border-muted-foreground/20 focus:ring-primary font-bold shadow-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={email} 
                      disabled 
                      className="h-12 pl-12 rounded-2xl bg-muted/50 border-transparent font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-muted-foreground/10">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Security & Password</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50">Current Password</Label>
                  <Input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    className="h-12 rounded-2xl bg-background border-muted-foreground/20 focus:ring-primary font-bold shadow-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50">New Password</Label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="h-12 rounded-2xl bg-background border-muted-foreground/20 focus:ring-primary font-bold shadow-none"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                disabled={loading || uploading}
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3 w-full md:w-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
