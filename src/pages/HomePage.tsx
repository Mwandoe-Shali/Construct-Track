import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Building2, ClipboardList } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Blur Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-white/30" /> {/* Updated to 30% opacity */}
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl backdrop-blur-sm bg-white/30 inline-block px-6 py-2 rounded-lg">
              Construction Inventory
              <span className="block text-blue-800"> Management System</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-900 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl backdrop-blur-sm bg-white/30 p-4 rounded-lg">
              Streamline your construction site inventory management with real-time tracking, 
              efficient material management, and comprehensive reporting.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button
                variant="contained"
                size="large"
                startIcon={<ClipboardList />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: '#1e40af',
                  '&:hover': {
                    backgroundColor: '#1e3a8a',
                  },
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Building2 />}
                onClick={() => navigate('/contact')}
                sx={{
                  borderColor: '#1e40af',
                  color: '#1e40af',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                  },
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}