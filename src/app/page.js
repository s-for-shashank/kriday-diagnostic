"use client"
import { useState, useEffect } from 'react';
import { Calendar, Phone, Clock, Star, Users, Award, CheckCircle, X, Menu, ChevronDown, ArrowRight, Zap, Shield, Heart, Activity, Microscope, FlaskConical, Stethoscope, Plus } from 'lucide-react';

export default function KridayDiagnostics() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [callbackModal, setCallbackModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    test: ''
  });
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    preferredTime: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      price: "₹299",
      originalPrice: "₹499",
      duration: "15 mins",
      description: "Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels",
      category: "Blood Tests",
      icon: Activity,
      color: "from-red-500 to-pink-600",
      features: ["Fasting not required", "Same day results", "Digital reports"],
      popular: false
    },
    {
      id: 2,
      name: "Lipid Profile",
      price: "₹499",
      originalPrice: "₹799",
      duration: "20 mins",
      description: "Cholesterol and triglyceride levels assessment for heart health monitoring",
      category: "Blood Tests",
      icon: Heart,
      color: "from-rose-500 to-red-600",
      features: ["12-hour fasting required", "Cardio health insights", "Risk assessment"],
      popular: true
    },
    {
      id: 3,
      name: "Diabetes Panel",
      price: "₹599",
      originalPrice: "₹899",
      duration: "25 mins",
      description: "HbA1c, fasting glucose, and post-meal glucose testing",
      category: "Blood Tests",
      icon: Zap,
      color: "from-orange-500 to-yellow-600",
      features: ["Comprehensive diabetes check", "3-month glucose average", "Dietary recommendations"],
      popular: false
    },
    {
      id: 4,
      name: "Thyroid Function Test",
      price: "₹699",
      originalPrice: "₹999",
      duration: "20 mins",
      description: "TSH, T3, T4 levels to assess thyroid gland function",
      category: "Hormone Tests",
      icon: Shield,
      color: "from-green-500 to-emerald-600",
      features: ["No fasting required", "Hormone balance check", "Metabolism insights"],
      popular: false
    },
    {
      id: 5,
      name: "Liver Function Test",
      price: "₹549",
      originalPrice: "₹799",
      duration: "20 mins",
      description: "ALT, AST, bilirubin levels to evaluate liver health",
      category: "Organ Tests",
      icon: FlaskConical,
      color: "from-teal-500 to-cyan-600",
      features: ["Liver health assessment", "Detox capacity check", "Enzyme analysis"],
      popular: false
    },
    {
      id: 6,
      name: "Kidney Function Test",
      price: "₹449",
      originalPrice: "₹699",
      duration: "15 mins",
      description: "Creatinine, BUN, and eGFR to assess kidney health",
      category: "Organ Tests",
      icon: Microscope,
      color: "from-blue-500 to-indigo-600",
      features: ["Kidney health monitoring", "Filtration rate check", "Early detection"],
      popular: false
    },
    {
      id: 7,
      name: "Vitamin D Test",
      price: "₹899",
      originalPrice: "₹1299",
      duration: "15 mins",
      description: "25-hydroxyvitamin D levels for bone health assessment",
      category: "Vitamin Tests",
      icon: Stethoscope,
      color: "from-purple-500 to-violet-600",
      features: ["Bone health indicator", "Immunity factor", "Deficiency detection"],
      popular: false
    },
    {
      id: 8,
      name: "Full Body Checkup",
      price: "₹2999",
      originalPrice: "₹4999",
      duration: "60 mins",
      description: "Comprehensive health screening with 75+ parameters",
      category: "Packages",
      icon: Plus,
      color: "from-pink-500 to-rose-600",
      features: ["Complete health assessment", "All major organs", "Consultation included"],
      popular: true
    }
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const handleBooking = (test) => {
    setSelectedTest(test);
    setBookingForm({...bookingForm, test: test.name});
    setBookingModal(true);
  };

  const handleBookingSubmit = () => {
    alert('🎉 Booking confirmed! You will receive a confirmation email shortly.');
    setBookingModal(false);
    setBookingForm({name: '', email: '', phone: '', date: '', time: '', test: ''});
  };

  const handleCallbackSubmit = () => {
    alert('📞 Callback request submitted! We will call you back within 30 minutes.');
    setCallbackModal(false);
    setCallbackForm({name: '', phone: '', preferredTime: ''});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Mouse Follower */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full pointer-events-none z-50 mix-blend-screen transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${scrollY > 100 ? 0.5 : 1})`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Kriday Diagnostics
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Tests', 'About', 'Contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-white/80 hover:text-white transition-all duration-300 group py-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <button 
                onClick={() => setCallbackModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Phone size={16} />
                Request Callback
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-2xl border-t border-white/10 animate-fade-in">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {['Home', 'Tests', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="block px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  {item}
                </a>
              ))}
              <button 
                onClick={() => setCallbackModal(true)}
                className="w-full text-left px-3 py-3 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300"
              >
                Request Callback
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div 
              className="inline-block animate-bounce mb-8"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Advanced Medical
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Diagnostics
              </span>
            </h1>
            
            <p className="text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare with our state-of-the-art testing facilities, delivering accurate results with unprecedented speed and precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('tests').scrollIntoView({behavior: 'smooth'})}
                className="group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 flex items-center gap-3"
              >
                Book Test Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => setCallbackModal(true)}
                className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Get Consultation
              </button>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {[
              { icon: Users, label: "Happy Patients", value: "50,000+", color: "from-cyan-400 to-blue-500" },
              { icon: Award, label: "Years Experience", value: "15+", color: "from-purple-400 to-pink-500" },
              { icon: CheckCircle, label: "Accuracy Rate", value: "99.9%", color: "from-green-400 to-emerald-500" },
              { icon: Clock, label: "Quick Results", value: "Same Day", color: "from-orange-400 to-red-500" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-110 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 shadow-2xl hover:shadow-xl transition-all duration-300 hover:rotate-12`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section id="tests" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Our Medical Tests</h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto">
              Cutting-edge diagnostic services powered by advanced technology and expert analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tests.map((test, index) => (
              <div 
                key={test.id} 
                className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {test.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10 animate-pulse">
                    Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${test.color} rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <test.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{test.price}</div>
                      <div className="text-white/50 line-through text-sm">{test.originalPrice}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-cyan-400 bg-cyan-400/10 px-3 py-2 rounded-full inline-block mb-4 border border-cyan-400/20">
                    {test.category}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                    {test.name}
                  </h3>
                  <p className="text-white/60 mb-6 text-sm leading-relaxed">{test.description}</p>
                  
                  <div className="flex items-center text-white/50 text-sm mb-6">
                    <Clock size={16} className="mr-2 text-cyan-400" />
                    {test.duration}
                  </div>

                  <div className="space-y-3 mb-8">
                    {test.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-white/70">
                        <CheckCircle size={14} className="mr-3 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleBooking(test)}
                    className={`w-full bg-gradient-to-r ${test.color} text-white py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-8">
                Why Choose 
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Kriday Diagnostics?
                </span>
              </h2>
              <p className="text-xl text-white/70 mb-12 leading-relaxed">
                With over 15 years of excellence in medical diagnostics, we combine cutting-edge technology with compassionate care to deliver accurate results you can trust.
              </p>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Advanced Technology",
                    description: "State-of-the-art equipment ensuring precise and reliable results",
                    icon: Zap,
                    color: "from-cyan-400 to-blue-500"
                  },
                  {
                    title: "Expert Team",
                    description: "Qualified pathologists and technicians with years of experience",
                    icon: Users,
                    color: "from-purple-400 to-pink-500"
                  },
                  {
                    title: "Quick Turnaround",
                    description: "Same-day results for most tests with digital report delivery",
                    icon: Clock,
                    color: "from-green-400 to-emerald-500"
                  },
                  {
                    title: "Affordable Pricing",
                    description: "Competitive rates without compromising on quality",
                    icon: Shield,
                    color: "from-orange-400 to-red-500"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:rotate-12 transition-all duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 transform hover:scale-105 transition-all duration-500 hover:rotate-1">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    99.9%
                  </div>
                  <div className="text-white/70 mb-6 text-xl">Accuracy Rate</div>
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-8 h-8 text-yellow-400 fill-current hover:scale-125 transition-transform duration-300" 
                      />
                    ))}
                  </div>
                  <p className="text-white/50 text-lg">Trusted by thousands of patients worldwide</p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <div className="text-2xl font-bold text-cyan-400">24/7</div>
                      <div className="text-white/60 text-sm">Support</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                      <div className="text-2xl font-bold text-purple-400">ISO</div>
                      <div className="text-white/60 text-sm">Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Get In Touch</h2>
            <p className="text-2xl text-white/70">We're here to help with your healthcare needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Call Us",
                details: ["+91 98765 43210", "+91 87654 32109"],
                color: "from-cyan-400 to-blue-500"
              },
              {
                icon: Calendar,
                title: "Working Hours",
                details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: 9:00 AM - 2:00 PM"],
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: Shield,
                title: "Emergency",
                details: ["24/7 Emergency Services", "Critical care available"],
                color: "from-green-400 to-emerald-500"
              }
            ].map((contact, index) => (
              <div 
                key={index}
                className="text-center p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-white/20 hover:scale-105 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${contact.color} rounded-2xl mx-auto mb-6 shadow-2xl hover:rotate-12 transition-all duration-300`}>
                  <contact.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{contact.title}</h3>
                {contact.details.map((detail, idx) => (
                  <p key={idx} className="text-white/70 text-lg mb-2">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-white">Book Your Appointment</h3>
                <button 
                  onClick={() => setBookingModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {selectedTest && (
                <div className={`bg-gradient-to-r ${selectedTest.color} p-6 rounded-2xl mb-8 shadow-xl`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <selectedTest.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{selectedTest.name}</h4>
                      <p className="text-white/80 text-sm">{selectedTest.category}</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">{selectedTest.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white">{selectedTest.price}</span>
                      <span className="text-white/60 line-through">{selectedTest.originalPrice}</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Clock size={16} className="mr-2" />
                      {selectedTest.duration}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Preferred Time</label>
                  <select
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">Select time slot</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-gray-800">{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Confirm Booking 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Callback Modal */}
      {callbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-white">Request Callback</h3>
                <button 
                  onClick={() => setCallbackModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm({...callbackForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm({...callbackForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Preferred Call Time</label>
                  <select
                    required
                    value={callbackForm.preferredTime}
                    onChange={(e) => setCallbackForm({...callbackForm, preferredTime: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">Select preferred time</option>
                    <option value="morning" className="bg-gray-800">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon" className="bg-gray-800">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening" className="bg-gray-800">Evening (5 PM - 8 PM)</option>
                    <option value="anytime" className="bg-gray-800">Anytime</option>
                  </select>
                </div>

                <button
                  onClick={handleCallbackSubmit}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Request Callback 📞
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-2xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Kriday Diagnostics
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Advanced medical diagnostics with compassionate care and accurate results for your well-being.
              </p>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Tests', 'About', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-white/60 hover:text-cyan-400 transition-colors duration-300 text-lg">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-xl font-bold text-white mb-6">Services</h4>
              <ul className="space-y-3 text-white/60 text-lg">
                <li>Blood Tests</li>
                <li>Hormone Tests</li>
                <li>Organ Function Tests</li>
                <li>Vitamin Tests</li>
              </ul>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h4 className="text-xl font-bold text-white mb-6">Contact Info</h4>
              <div className="space-y-4 text-white/60 text-lg">
                <p className="flex items-center"><Phone size={18} className="mr-3 text-cyan-400" /> +91 98765 43210</p>
                <p className="flex items-center"><span className="mr-3 text-cyan-400">📧</span> info@kridaydiagnostics.com</p>
                <p className="flex items-center"><span className="mr-3 text-cyan-400">📍</span> 123 Healthcare Street, Medical District</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60 text-lg">
              &copy; 2024 Kriday Diagnostics. All rights reserved. | Made with ❤️ for better healthcare
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}