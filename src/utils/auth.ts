export const getRouteByRole = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin';
    case 'manager':
      return '/manager';
    case 'employee':
      return '/employee';
    default:
      return '/';
  }
};