import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Get in touch with our team for any questions about our construction inventory management system.
          </Typography>

          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-600" />
              <Typography>support@construction-inventory.com</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-blue-600" />
              <Typography>+1 (555) 123-4567</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600" />
              <Typography>123 Construction Ave, Building City, BC 12345</Typography>
            </div>
          </div>
        </div>

        <Card>
          <CardContent>
            {submitted ? (
              <Alert severity="success">
                Thank you for your message! We'll get back to you soon.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Name"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}