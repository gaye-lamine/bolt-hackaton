import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { PremiumGate } from '../components/Premium/PremiumGate';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../hooks/usePremium';

interface AnalyticsData {
  totalServices: number;
  activeServices: number;
  totalClients: number;
  averageServicePrice: number;
  topService: string;
  clientGrowth: number;
  recentClients: number;
  estimatedMonthlyRevenue: number;
}

export const Analytics = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalServices: 0,
    activeServices: 0,
    totalClients: 0,
    averageServicePrice: 0,
    topService: '',
    clientGrowth: 0,
    recentClients: 0,
    estimatedMonthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Fetch services data
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);

      if (servicesError) throw servicesError;

      // Fetch clients data
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);

      if (clientsError) throw clientsError;

      // Fetch recent clients (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentClientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate analytics
      const totalServices = services?.length || 0;
      const activeServices = services?.filter(s => s.is_active).length || 0;
      const totalClients = clients?.length || 0;
      const recentClients = recentClientsData?.length || 0;

      // Calculate average service price
      const averageServicePrice = services?.length 
        ? services.reduce((sum, service) => sum + service.price_from, 0) / services.length
        : 0;

      // Find top service (highest price)
      const topService = services?.length 
        ? services.reduce((top, service) => 
            service.price_from > top.price_from ? service : top
          ).title
        : '';

      // Calculate client growth percentage
      const previousMonthClients = totalClients - recentClients;
      const clientGrowth = previousMonthClients > 0 
        ? Math.round((recentClients / previousMonthClients) * 100)
        : recentClients > 0 ? 100 : 0;

      // Estimate monthly revenue based on services and clients
      const estimatedMonthlyRevenue = activeServices > 0 && totalClients > 0
        ? Math.round(averageServicePrice * totalClients * 0.5) // Estimation conservative
        : 0;

      setAnalytics({
        totalServices,
        activeServices,
        totalClients,
        averageServicePrice,
        topService,
        clientGrowth,
        recentClients,
        estimatedMonthlyRevenue,
      });

      // Generate weekly data based on real client creation dates
      const weeklyStats = generateWeeklyData(clients || []);
      setWeeklyData(weeklyStats);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (clients: any[]) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekData = days.map(day => ({ day, clients: 0, activity: 0 }));

    // Count clients by day of week
    clients.forEach(client => {
      const date = new Date(client.created_at);
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      weekData[dayIndex].clients++;
      weekData[dayIndex].activity += 1;
    });

    return weekData;
  };

  const BasicAnalytics = () => {
    const statCards = [
      {
        title: 'Services actifs',
        value: analytics.activeServices,
        change: analytics.totalServices > 0 ? `${analytics.totalServices} total` : 'Aucun service créé',
        changeType: 'neutral' as const,
        icon: Briefcase,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        title: 'Clients totaux',
        value: analytics.totalClients,
        change: analytics.recentClients > 0 ? `${analytics.recentClients} nouveaux ce mois` : 'Aucun client',
        changeType: analytics.recentClients > 0 ? 'positive' as const : 'neutral' as const,
        icon: Users,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100 dark:bg-teal-900',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-medium transition-shadow" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
            Conseils pour améliorer vos performances
          </h2>
          <div className="space-y-4">
            {analytics.totalServices === 0 ? (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-xs">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Créez vos premiers services
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Commencez par définir 2-3 services que vous proposez
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Services créés
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Vous avez {analytics.totalServices} service{analytics.totalServices > 1 ? 's' : ''}, c'est un bon début !
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                🚀 Passez à Premium pour débloquer :
              </h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                <li>• Analyses détaillées de revenus et prévisions</li>
                <li>• Comparaison avec la concurrence locale</li>
                <li>• Recommandations personnalisées d'optimisation</li>
                <li>• Tableaux de bord avancés et rapports</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const PremiumAnalytics = () => {
    const statCards = [
      {
        title: 'Revenus estimés',
        value: analytics.estimatedMonthlyRevenue > 0 ? formatPrice(analytics.estimatedMonthlyRevenue) : formatPrice(0),
        change: analytics.estimatedMonthlyRevenue > 0 ? 'par mois (estimation)' : 'Créez des services pour commencer',
        changeType: analytics.estimatedMonthlyRevenue > 0 ? 'positive' as const : 'neutral' as const,
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        title: 'Services actifs',
        value: analytics.activeServices,
        change: analytics.totalServices > 0 ? `${analytics.totalServices} total` : 'Aucun service créé',
        changeType: 'neutral' as const,
        icon: Briefcase,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        title: 'Clients totaux',
        value: analytics.totalClients,
        change: analytics.clientGrowth > 0 ? `+${analytics.clientGrowth}% ce mois` : analytics.recentClients > 0 ? `${analytics.recentClients} nouveaux ce mois` : 'Aucun client',
        changeType: analytics.clientGrowth > 0 ? 'positive' as const : 'neutral' as const,
        icon: Users,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100 dark:bg-teal-900',
      },
      {
        title: 'Prix moyen',
        value: analytics.averageServicePrice > 0 ? formatPrice(analytics.averageServicePrice) : formatPrice(0),
        change: 'par service',
        changeType: 'neutral' as const,
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900',
      },
    ];

    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-medium transition-shadow" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
              Activité par jour de la semaine
            </h2>
            {weeklyData.some(day => day.activity > 0) ? (
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-8">
                        {day.day}
                      </span>
                      <div className="flex-1 w-32">
                        <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.max(5, (day.activity / Math.max(1, Math.max(...weeklyData.map(d => d.activity)))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        {day.clients} client{day.clients > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Aucune activité enregistrée
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Ajoutez des clients pour voir l'activité
                </p>
              </div>
            )}
          </Card>

          {/* Premium Insights */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
              Insights Premium ✨
            </h2>
            <div className="space-y-4">
              {analytics.topService ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                      Service le plus rentable
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {analytics.topService} - Optimisez ce service pour maximiser vos revenus
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="text-neutral-400 mr-2" size={20} />
                    <h3 className="font-medium text-neutral-600 dark:text-neutral-400">
                      Aucun service créé
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">
                    Commencez par créer vos premiers services
                  </p>
                </div>
              )}

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="text-green-600 dark:text-green-400 mr-2" size={20} />
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    Prévision de croissance
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {analytics.clientGrowth > 0 
                    ? `Avec +${analytics.clientGrowth}% de croissance, vous pourriez atteindre ${Math.round(analytics.totalClients * 1.5)} clients d'ici 3 mois`
                    : 'Concentrez-vous sur l\'acquisition de vos 5 premiers clients pour démarrer'
                  }
                </p>
              </div>

              {analytics.estimatedMonthlyRevenue > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="text-yellow-600 dark:text-yellow-400 mr-2" size={20} />
                    <h3 className="font-medium text-yellow-900 dark:text-yellow-100">
                      Optimisation revenus
                    </h3>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    En augmentant vos tarifs de 15% et en ajoutant 2 clients/mois, vous pourriez atteindre {formatPrice(Math.round(analytics.estimatedMonthlyRevenue * 1.4))} par mois
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Advanced Recommendations */}
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
            Recommandations Premium pour maximiser vos revenus
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-xs">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Stratégie de prix dynamique
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Augmentez vos tarifs de 10-15% pour les nouveaux clients et créez des forfaits premium
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-xs">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Optimisation temporelle
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Concentrez-vous sur les créneaux les plus rentables et proposez des tarifs majorés en urgence
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-purple-600 dark:text-purple-400 text-xs">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Programme de fidélisation
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Créez un système de points : 10ème service gratuit pour augmenter la rétention
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-orange-600 dark:text-orange-400 text-xs">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-50">
                    Expansion de services
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Ajoutez des services complémentaires pour augmenter le panier moyen de 40%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
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
              <p className="text-neutral-600 dark:text-neutral-300">Chargement des statistiques...</p>
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
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                Statistiques {isPremium && '✨ Premium'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                {isPremium 
                  ? 'Analyses complètes de performance avec insights avancés (montants en CFA)'
                  : 'Statistiques de base - Passez à Premium pour des analyses détaillées (montants en CFA)'
                }
              </p>
            </div>

            {isPremium ? (
              <PremiumAnalytics />
            ) : (
              <PremiumGate
                feature="detailed_analytics"
                title="Statistiques Détaillées Premium"
                description="Accédez à des analyses complètes, des prévisions de revenus, et des recommandations personnalisées pour optimiser votre micro-entreprise."
              >
                <PremiumAnalytics />
              </PremiumGate>
            )}

            {!isPremium && <BasicAnalytics />}
          </div>
        </main>
      </div>
    </div>
  );
};