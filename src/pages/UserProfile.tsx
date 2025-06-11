import React, { useState, useEffect } from 'react';
import { Edit, Save, X, ExternalLink, Copy, Check } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileData {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  phone: string;
  skills: string[];
  availability: string[];
  transport_means: string[];
}

export const UserProfile = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    skills: [],
    availability: [],
    transport_means: [],
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setEditing(false);
  };

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/profile/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPublicProfile = () => {
    window.open(`/profile/${profile?.username}`, '_blank');
  };

  const handleArrayInput = (field: keyof Pick<UserProfileData, 'skills' | 'availability' | 'transport_means'>, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData({ ...formData, [field]: items });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-300">Chargement de votre profil...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex items-center justify-center">
            <Card className="text-center">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                Profil non trouvé
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Impossible de charger votre profil. Veuillez réessayer.
              </p>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                  Mon profil
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Gérez vos informations personnelles et votre profil public
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={openPublicProfile}
                  size="sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Voir profil public
                </Button>
                {!editing ? (
                  <Button onClick={() => setEditing(true)} size="sm">
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} loading={saving} size="sm">
                      <Save size={16} className="mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      <X size={16} className="mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {profile.full_name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                    {profile.full_name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    @{profile.username}
                  </p>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-600 rounded-lg p-3 mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                      URL de votre profil public :
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-white dark:bg-neutral-700 px-2 py-1 rounded border text-neutral-800 dark:text-neutral-200">
                        /profile/{profile.username}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyProfileUrl}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </Button>
                    </div>
                  </div>

                  <div className="text-left space-y-3">
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">Compétences</h3>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">Disponibilités</h3>
                      <div className="flex flex-wrap gap-1">
                        {profile.availability.map((slot, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded text-xs"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profile Form */}
              <Card className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                  Informations personnelles
                </h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Nom complet"
                      value={editing ? formData.full_name : profile.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!editing}
                    />
                    <Input
                      label="Nom d'utilisateur"
                      value={editing ? formData.username : profile.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!editing}
                      helper="Utilisé dans l'URL de votre profil public"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Bio / Présentation
                    </label>
                    <textarea
                      value={editing ? formData.bio : profile.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editing}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                 placeholder-neutral-500 dark:placeholder-neutral-400
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Localisation"
                      value={editing ? formData.location : profile.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!editing}
                    />
                    <Input
                      label="Téléphone"
                      value={editing ? formData.phone : profile.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <Input
                      label="Compétences"
                      value={editing ? formData.skills.join(', ') : profile.skills.join(', ')}
                      onChange={(e) => handleArrayInput('skills', e.target.value)}
                      disabled={!editing}
                      helper="Séparez vos compétences par des virgules"
                    />
                  </div>

                  <div>
                    <Input
                      label="Disponibilités"
                      value={editing ? formData.availability.join(', ') : profile.availability.join(', ')}
                      onChange={(e) => handleArrayInput('availability', e.target.value)}
                      disabled={!editing}
                      helper="Ex: Lundi matin, Mercredi après-midi, Week-end"
                    />
                  </div>

                  <div>
                    <Input
                      label="Moyens de transport"
                      value={editing ? formData.transport_means.join(', ') : profile.transport_means.join(', ')}
                      onChange={(e) => handleArrayInput('transport_means', e.target.value)}
                      disabled={!editing}
                      helper="Ex: Voiture, Vélo, Transports en commun"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};