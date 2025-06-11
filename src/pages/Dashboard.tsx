import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, Calendar, MessageCircle, Star, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalClients: 0,
    activeServices: 0,
    recentClients: 0,
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setNeedsOnboarding(true);
          setLoading(false);
          return;
        }
        throw profileError;
      }

      if (profile) {
        setUserProfile(profile);
        
        if (!profile.onboarding_completed) {
          setNeedsOnboarding(true);
          setLoading(false);
          return;
        }

        // Fetch services
        const { data: services } = await supabase
          .from('services')
          .select('*')
          .eq('user_id', user.id);

        // Fetch clients
        const { data: clients } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);

        // Fetch recent clients (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: recentClientsData } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        const activeServicesCount = services?.filter(s => s.is_active).length || 0;

        setStats({
          totalServices: services?.length || 0,
          totalClients: clients?.length || 0,
          activeServices: activeServicesCount,
          recentClients: recentClientsData?.length || 0,
        });

        // Build recent activity from real data
        const activity = [];
        
        // Add recent clients
        if (recentClientsData && recentClientsData.length > 0) {
          recentClientsData.slice(0, 2).forEach(client => {
            activity.push({
              id: `client-${client.id}`,
              type: 'client',
              message: `Nouveau client: ${client.name}`,
              time: getTimeAgo(client.created_at),
            });
          });
        }

        // Add recent services
        if (services && services.length > 0) {
          const recentServices = services
            .filter(s => s.is_active)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 2);
          
          recentServices.forEach(service => {
            activity.push({
              id: `service-${service.id}`,
              type: 'service',
              message: `Service "${service.title}" ${service.is_active ? 'activé' : 'créé'}`,
              time: getTimeAgo(service.created_at),
            });
          });
        }

        // Sort by most recent
        activity.sort((a, b) => {
          const timeA = parseTimeAgo(a.time);
          const timeB = parseTimeAgo(b.time);
          return timeA - timeB;
        });

        setRecentActivity(activity.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}sem`;
  };

  const parseTimeAgo = (timeString: string) => {
    if (timeString === 'À l\'instant') return 0;
    const num = parseInt(timeString);
    if (timeString.includes('h')) return num;
    if (timeString.includes('j')) return num * 24;
    if (timeString.includes('sem')) return num * 24 * 7;
    return 0;
  };

  const handleStartOnboarding = () => {
    window.location.href = '/onboarding';
  };

  const statCards = [
    {
      title: 'Services actifs',
      value: stats.activeServices,
      total: stats.totalServices,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      link: '/services',
    },
    {
      title: 'Total clients',
      value: stats.totalClients,
      subtitle: `+${stats.recentClients} cette semaine`,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900',
      link: '/clients',
    },
    {
      title: 'Profil complété',
      value: userProfile?.onboarding_completed ? '100%' : '0%',
      subtitle: userProfile?.onboarding_completed ? 'Profil actif' : 'À compléter',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      link: '/profile',
    },
    {
      title: 'Assistant IA',
      value: 'Disponible',
      subtitle: 'Conseils personnalisés',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      link: '/ai-coach',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Bienvenue sur NOMAD AI !
            </h1>
            
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Pour commencer à utiliser votre tableau de bord, vous devez d'abord configurer votre profil de micro-entreprise avec notre assistant IA.
            </p>
            
            <Button onClick={handleStartOnboarding} size="lg" className="w-full">
              Commencer la configuration
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Contenu principal avec marge correcte */}
        <main className="flex-1 lg:pl-0">
          <div className="p-4 sm:p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                Bonjour {userProfile?.full_name || user?.email?.split('@')[0]} ! 👋
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Voici un aperçu de votre activité
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Link key={index} to={stat.link}>
                  <Card className="hover:shadow-medium transition-all duration-200 hover:scale-105 cursor-pointer group" hover>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                          {stat.value}
                        </p>
                        {stat.total !== undefined && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            sur {stat.total} total{stat.total > 1 ? 's' : ''}
                          </p>
                        )}
                        {stat.subtitle && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {stat.subtitle}
                          </p>
                        )}
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                    Actions rapides
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/services">
                      <Button 
                        variant="outline" 
                        className="w-full h-20 flex flex-col items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                      >
                        <Briefcase className="mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <span>Gérer mes services</span>
                      </Button>
                    </Link>
                    
                    <Link to="/clients">
                      <Button 
                        variant="outline" 
                        className="w-full h-20 flex flex-col items-center justify-center hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group"
                      >
                        <Users className="mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <span>Ajouter un client</span>
                      </Button>
                    </Link>
                    
                    <Link to="/ai-coach">
                      <Button 
                        variant="outline" 
                        className="w-full h-20 flex flex-col items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                      >
                        <MessageCircle className="mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <span>Coach IA</span>
                      </Button>
                    </Link>
                    
                    <Link to="/analytics">
                      <Button 
                        variant="outline" 
                        className="w-full h-20 flex flex-col items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                      >
                        <TrendingUp className="mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <span>Voir statistiques</span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                  Activité récente
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'client' ? 'bg-teal-500' : 
                          activity.type === 'service' ? 'bg-purple-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-900 dark:text-neutral-50">
                            {activity.message}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Il y a {activity.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Aucune activité récente
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                        Commencez par créer vos services
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Profile Preview */}
            {userProfile && (
              <Card className="mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4 md:mb-0 font-display">
                    Votre profil public
                  </h2>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`/profile/${userProfile.username}`, '_blank')}
                    >
                      Voir le profil public
                    </Button>
                    <Link to="/profile">
                      <Button>
                        Modifier le profil
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-soft">
                      <span className="text-white font-bold text-xl">
                        {userProfile.full_name?.charAt(0) || user?.email?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                        {userProfile.full_name}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                        {userProfile.bio || 'Professionnel des services locaux'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills?.slice(0, 3).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white dark:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-600 shadow-soft"
                          >
                            {skill}
                          </span>
                        ))}
                        {userProfile.skills?.length > 3 && (
                          <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-600 text-sm text-neutral-500 dark:text-neutral-400 rounded-full">
                            +{userProfile.skills.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};