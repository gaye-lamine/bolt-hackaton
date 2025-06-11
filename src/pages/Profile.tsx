import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Star, Clock, Car } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

interface UserProfile {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  phone: string;
  skills: string[];
  availability: string[];
  transport_means: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  price_from: number;
  price_to?: number;
  price_unit: string;
  category: string;
}

export const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchProfileData();
    }
  }, [username]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fetchProfileData = async () => {
    try {
      // Fetch user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      setProfile(userProfile);

      // Fetch user services
      const { data: userServices, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('is_active', true);

      if (servicesError) throw servicesError;

      setServices(userServices || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string, service: string) => {
    const message = encodeURIComponent(`Bonjour ! Je suis intéressé(e) par votre service "${service}". Pouvez-vous me donner plus d'informations ?`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Profil non trouvé
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Ce profil n'existe pas ou n'est plus disponible.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold">
                {profile.full_name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {profile.full_name}
              </h1>
              <p className="text-lg text-purple-100 mb-4">
                {profile.bio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {profile.location}
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-2" />
                  4.8/5 (24 avis)
                </div>
                <div className="flex items-center">
                  <Car size={16} className="mr-2" />
                  {profile.transport_means?.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
              Mes services
            </h2>
            
            <div className="space-y-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          À partir de {formatPrice(service.price_from)}/{service.price_unit}
                          {service.price_to && ` - ${formatPrice(service.price_to)}/${service.price_unit}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContact(profile.phone)}
                      >
                        <Phone size={16} className="mr-2" />
                        Appeler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleWhatsApp(profile.phone, service.title)}
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleContact(profile.phone)}
                >
                  <Phone size={16} className="mr-2" />
                  Appeler maintenant
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleWhatsApp(profile.phone, 'contact général')}
                >
                  WhatsApp
                </Button>
              </div>
            </Card>

            {/* Availability */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center">
                <Clock size={18} className="mr-2" />
                Disponibilités
              </h3>
              <div className="space-y-2">
                {profile.availability?.map((slot, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Compétences
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Pricing Info */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Informations tarifaires
              </h3>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                <p className="mb-2">💰 Tous les prix sont affichés en <strong>Franc CFA (XOF)</strong></p>
                <p className="mb-2">📞 Devis gratuit sur demande</p>
                <p>💳 Paiement en espèces ou mobile money</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};