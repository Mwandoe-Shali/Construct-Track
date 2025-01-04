export type UserRole = 'manager' | 'supervisor';

export const roles = {
  /**
   * Extracts role from email using Gmail plus addressing
   * Example: john.doe+manager@gmail.com -> manager
   */
  getRoleFromEmail(email: string): UserRole {
    const plusMatch = email.match(/\+(\w+)@/);
    if (plusMatch) {
      const role = plusMatch[1].toLowerCase();
      return role === 'manager' ? 'manager' : 'supervisor';
    }
    return 'supervisor'; // Default role
  },

  /**
   * Validates if the email has a valid role suffix using Gmail plus addressing
   */
  isValidRoleEmail(email: string): boolean {
    if (!email.includes('@gmail.com')) {
      return false;
    }
    
    const plusMatch = email.match(/\+(\w+)@/);
    if (!plusMatch) return false;
    
    const role = plusMatch[1].toLowerCase();
    return role === 'manager' || role === 'supervisor';
  }
};