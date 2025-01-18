# ConstrucTrack - Construction Inventory Management System

## Overview
ConstrucTrack is a modern web application designed to streamline construction site inventory management. It provides a robust platform for managers and site supervisors to track materials, manage sites, and coordinate construction activities efficiently.

This project marks the culmination of 12 continuous months of learning and specialization in Frontend Development at ALX.

## Key Features
- **Role-Based Access Control**
  - Manager dashboard for complete site and supervisor management
  - Supervisor dashboard for site-specific material management
  - Secure authentication using Gmail plus addressing (e.g., user+manager@gmail.com)

- **Site Management**
  - Create, edit, and delete construction sites
  - Track site details (location, building type, size)
  - Assign supervisors to specific sites

- **Material Management**
  - Real-time inventory tracking
  - Material quantity and unit management
  - Historical tracking with timestamps

- **Dynamic Theme Support**
  - Light theme with sepia and golden accents
  - Dark theme with grey-scale and golden highlights
  - Smooth transitions between themes

## Technologies Used

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- Redux Toolkit for state management
- React Query for server state
- Tailwind CSS for utility styles

### Backend
- Supabase for:
  - Authentication
  - Database (PostgreSQL)
  - Row Level Security (RLS)
  - Real-time subscriptions

### Development Tools
- Vite for fast development and building
- ESLint for code quality
- Vitest for testing

## Project Structure
```
src/
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   └── Layout.tsx     # Main layout wrapper
│
├── hooks/              # Custom React hooks
│
├── pages/              # Route pages
│
├── services/           # API and business logic
│
├── store/              # Redux store configuration
│
├── theme/              # Theme configuration
│
└── types/              # TypeScript type definitions
```

## Key Implementation Details

### 1. Role-Based Authentication
```typescript
// Using Gmail plus addressing for role determination
const role = email.includes('+manager@') ? 'manager' : 'supervisor';
```

### 2. Real-time Updates
```typescript
// Subscribe to database changes
supabase
  .channel('table_channel')
  .on('postgres_changes', { event: '*', schema: 'public' }, 
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe();
```

### 3. Theme Switching
```typescript
// Dynamic theme application
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(mode);
```

### 4. Row Level Security (RLS)
```sql
-- Example of RLS policy for site access
CREATE POLICY "supervisors_view_assigned_sites"
ON sites FOR SELECT
USING (EXISTS (
  SELECT 1 FROM site_supervisors
  WHERE site_id = sites.id
  AND user_id = auth.uid()
));
```
## Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/Mwandoe-Shali/constructrack.git
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environmental variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run development server:
```bash
npm run dev
```
## Best Practices Used
### 1. Type Safety

- Comprehensive TypeScript types for all components
- Strong typing for API responses and state management

### 2. Performance Optimization

- Memoization of expensive computations
- Efficient re-rendering with React.memo
- Proper use of useCallback and useMemo

### 3. Security

- Row Level Security for data access control
- Role-based access control
- Secure authentication flow

### 4. Code Organization

- Feature-based folder structure
- Separation of concerns
- Reusable components and hooks


## Contributing
Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request




## Conclusion

This specialization project is a testament to my dedication and hard work over the past year. I am excited to continue my journey in the tech industry and apply the skills I have acquired to real-world challenges.

## Contact
For any inquiries or collaboration opportunities, feel free to reach out to me at [mwandoeshali@gmail.com](mailto:mwandoeshali@gmail.com).
