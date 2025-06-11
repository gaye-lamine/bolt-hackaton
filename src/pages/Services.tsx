import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  title: string;
  description: string;
  price_from: number;
  price_to?: number;
  price_unit: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export const Services = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_from: '',
    price_to: '',
    price_unit: 'heure',
    category: '',
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        price_from: parseFloat(formData.price_from),
        price_to: formData.price_to ? parseFloat(formData.price_to) : null,
        price_unit: formData.price_unit,
        category: formData.category,
        user_id: user.id,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
      }

      setFormData({
        title: '',
        description: '',
        price_from: '',
        price_to: '',
        price_unit: 'heure',
        category: '',
      });
      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price_from: service.price_from.toString(),
      price_to: service.price_to?.toString() || '',
      price_unit: service.price_unit,
      category: service.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleActive = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !isActive })
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
              <p className="text-neutral-600 dark:text-neutral-300">Chargement de vos services...</p>
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
                  Mes services
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Gérez vos services et tarifs (prix en Franc CFA)
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditingService(null);
                  setFormData({
                    title: '',
                    description: '',
                    price_from: '',
                    price_to: '',
                    price_unit: 'heure',
                    category: '',
                  });
                }}
              >
                <Plus size={20} className="mr-2" />
                Nouveau service
              </Button>
            </div>

            {showForm && (
              <Card className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                  {editingService ? 'Modifier le service' : 'Nouveau service'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Titre du service"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <Input
                      label="Catégorie"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                 placeholder-neutral-500 dark:placeholder-neutral-400
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Prix minimum (CFA)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={formData.price_from}
                          onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                     bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                     placeholder-neutral-500 dark:placeholder-neutral-400
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="5000"
                          required
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400">
                          CFA
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Prix maximum (CFA) - optionnel
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={formData.price_to}
                          onChange={(e) => setFormData({ ...formData, price_to: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                     bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                     placeholder-neutral-500 dark:placeholder-neutral-400
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="10000"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400">
                          CFA
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Unité
                      </label>
                      <select
                        value={formData.price_unit}
                        onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                   bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="heure">par heure</option>
                        <option value="jour">par jour</option>
                        <option value="mission">par mission</option>
                        <option value="km">par km</option>
                        <option value="mois">par mois</option>
                        <option value="semaine">par semaine</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit">
                      {editingService ? 'Mettre à jour' : 'Créer le service'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingService(null);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {services.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-neutral-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                  Aucun service créé
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  Commencez par créer votre premier service pour attirer des clients
                </p>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingService(null);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Créer mon premier service
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {services.map((service) => (
                  <Card key={service.id}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mr-3 font-display">
                            {service.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.is_active
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : 'bg-neutral-100 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {service.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {formatPrice(service.price_from)}
                            {service.price_to && ` - ${formatPrice(service.price_to)}`}
                            /{service.price_unit}
                          </span>
                          <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-600 rounded">
                            {service.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(service.id, service.is_active)}
                        >
                          {service.is_active ? (
                            <EyeOff size={16} className="mr-2" />
                          ) : (
                            <Eye size={16} className="mr-2" />
                          )}
                          {service.is_active ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit size={16} className="mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Supprimer
                        </Button>
                      </div>
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