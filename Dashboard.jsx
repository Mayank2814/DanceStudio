import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-xl">💃</span>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">DanceStudio</h3>
                <p className="text-xs text-gray-400">Move with Grace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Your premier destination for professional dance classes and artistic expression.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="w-10 h-10 bg-dark-lighter rounded-lg flex items-center justify-center 
                           text-gray-400 hover:text-accent-pink hover:bg-accent-pink/10 transition-all"
                >
                  <span className="sr-only">{social}</span>
                  {social === 'facebook' && '📘'}
                  {social === 'instagram' && '📷'}
                  {social === 'twitter' && '🐦'}
                  {social === 'youtube' && '📹'}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Classes', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-accent-pink transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dance Styles */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Dance Styles</h4>
            <ul className="space-y-2">
              {['Ballet', 'Hip Hop', 'Contemporary', 'Salsa'].map((style) => (
                <li key={style}>
                  <Link to="/classes" className="text-gray-400 hover:text-accent-pink transition-colors">
                    {style}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>123 Dance Street, NYC</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <span>hello@dancestudio.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🕐</span>
                <span>Mon-Sat: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} DanceStudio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-accent-pink text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-accent-pink text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
