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
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

- ![MUI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white) - For UI components

- ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) - For State Management

- ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) - For Server state

- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) - For utility styles

### Backend
- ![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E) - For authenication, Row Level Security (RLS), and Real-time subscriptions

- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) - For database

### Testing & Development Tools
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) - For fast development and building

- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) - For code quality

- ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) -For testing

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
1.  Fork the repository
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Create a Pull Request




## Conclusion

> This specialization project is a testament to my dedication and hard work over the past year. I am excited to continue my journey in the tech industry and apply the skills I have acquired to real-world challenges.

## Contact
For any inquiries or collaboration opportunities, feel free to reach out to me at [mwandoeshali@gmail.com](mailto:mwandoeshali@gmail.com).