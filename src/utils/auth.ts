export const getRouteByRole = (role: string): string => {
  if (!role) {
    console.warn('getRouteByRole: role is empty or undefined');
    return '/login';
  }
  const normalizedRole = (role || '').toLowerCase().trim();
  console.log('getRouteByRole input:', role, 'normalized:', normalizedRole);
  
  switch (normalizedRole) {
    case 'hr_manager':
      return '/hr';
    case 'manager':
      return '/manager/requests';
    case 'employee':
    case 'employer': // fallback for "employer" if backend uses it
      return '/employee';
    default:
      console.warn('getRouteByRole: unknown role', role, 'normalized:', normalizedRole);
      return '/login';
  }
};