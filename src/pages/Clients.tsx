import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export const Clients = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const clientData = {
        ...formData,
        user_id: user.id,
      };

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([clientData]);

        if (error) throw error;
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
      setShowForm(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
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
              <p className="text-neutral-600 dark:text-neutral-300">Chargement de vos clients...</p>
            </div>
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
                  Mes clients
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Gérez votre carnet d'adresses clients
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditingClient(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    notes: '',
                  });
                }}
              >
                <Plus size={20} className="mr-2" />
                Nouveau client
              </Button>
            </div>

            {showForm && (
              <Card className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                  {editingClient ? 'Modifier le client' : 'Nouveau client'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                      label="Adresse"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      placeholder="Notes sur le client, préférences, historique..."
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                 placeholder-neutral-500 dark:placeholder-neutral-400
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit">
                      {editingClient ? 'Mettre à jour' : 'Ajouter le client'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingClient(null);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {clients.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-neutral-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                  Aucun client enregistré
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  Commencez à construire votre carnet d'adresses clients
                </p>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingClient(null);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Ajouter mon premier client
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card key={client.id} className="hover:shadow-medium transition-shadow" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3 font-display">
                      {client.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      {client.email && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                          <Mail size={14} className="mr-2" />
                          <button
                            onClick={() => handleEmail(client.email!)}
                            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {client.email}
                          </button>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                          <Phone size={14} className="mr-2" />
                          <button
                            onClick={() => handleContact(client.phone!)}
                            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {client.phone}
                          </button>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                          <MapPin size={14} className="mr-2" />
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>

                    {client.notes && (
                      <div className="bg-neutral-50 dark:bg-neutral-600 rounded-lg p-3 mb-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                          {client.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {client.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(client.phone!)}
                          className="flex-1"
                        >
                          <Phone size={14} className="mr-1" />
                          Appeler
                        </Button>
                      )}
                      {client.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEmail(client.email!)}
                          className="flex-1"
                        >
                          <Mail size={14} className="mr-1" />
                          Email
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};