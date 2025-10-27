import { Link } from 'react-router-dom';
import { Brain, BarChart3, UtensilsCrossed, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Smart Dashboard',
      description: 'Track your nutrition data with real-time insights and comprehensive analytics.',
      gradient: 'from-emerald-500 to-teal-600',
      link: '/dashboard',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Query System',
      description: 'Ask questions in natural language and get instant answers from our semantic database.',
      gradient: 'from-cyan-500 to-blue-600',
      link: '/',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Personalized Recipes',
      description: 'Get meal recommendations tailored to your health goals and dietary preferences.',
      gradient: 'from-orange-500 to-amber-600',
      link: '/recipes',
    },
  ];

  const benefits = [
    'AI-powered nutritional insights',
    'Personalized meal planning',
    'SPARQL semantic queries',
    'Real-time health tracking',
    'Recipe recommendations',
    'Dietary preference support',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI-Powered Nutrition Platform</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Transform Your Health with NutritionGO
                </h1>
                
                <p className="text-lg text-emerald-50 mb-6 leading-relaxed">
                  Harness the power of semantic AI and personalized nutrition to achieve your wellness goals. 
                  Smart insights, custom recipes, and data-driven recommendations.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Link
                    to="/recipes"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Try AI Query
                  </Link>
                </div>
              </div>

              {/* Right Benefits */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-emerald-50 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-3">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-semibold text-emerald-700">Powerful Features</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Everything You Need for Better Nutrition
              </h2>
              <p className="text-lg text-gray-600">
                Our comprehensive platform combines cutting-edge AI with proven nutrition science
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Link
                  key={idx}
                  to={feature.link}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">{feature.description}</p>
                  
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-center">Trusted by Health-Conscious Users</h2>
            <p className="text-emerald-50 text-center mb-6">Join thousands making smarter nutrition choices</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '50K+', label: 'Recipes Generated' },
                { value: '100K+', label: 'AI Queries Processed' },
                { value: '99.9%', label: 'Satisfaction Rate' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                  <div className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-emerald-50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Ready to Transform Your Nutrition?</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your journey to better health with AI-powered insights and personalized recommendations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-all border-2 border-emerald-200"
              >
                Ask AI a Question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;