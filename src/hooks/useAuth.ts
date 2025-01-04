import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { supabase } from '../lib/supabase';
import { roles } from '../services/roles';
import type { User } from '../types';

export function useAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            role: roles.getRoleFromEmail(session.user.email!)
          };
          dispatch(setUser(user));
        } else {
          dispatch(setUser(null));
        }
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          role: roles.getRoleFromEmail(session.user.email!)
        };
        dispatch(setUser(user));
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return { loading };
}