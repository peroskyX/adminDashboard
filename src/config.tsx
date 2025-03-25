import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Home, User, LogOut, BarChart, CurrencyIcon } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Home',
      href: '/admin',
      icon: <Home size={20} />,
      active: pathname === '/',
      position: 'top',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/users'),
      position: 'top',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart size={20} />,
      active: isNavItemActive(pathname, '/analytics'),
      position: 'top',
    },
    {
      name: 'UsersAnalytics',
      href: '/admin/usersanalytics',
      icon: <BarChart size={20} />,
      active: isNavItemActive(pathname, '/usersanalytics'),
      position: 'top',
    },
    {
      name: 'UserActivities',
      href: '/admin/useractivities',
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/useractivities'),
      position: 'top',
    },
    {
      name: 'Credits',
      href: '/admin/credits',
      icon: <CurrencyIcon size={20} />,
      active: isNavItemActive(pathname, '/credits'),
      position: 'top',
    },
    {
      name: 'Businesses',
      href: '/admin/businesses',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/businesses'),
      position: 'top',
    },
    {
      name: 'Logout',
      href: '/sign-out',
      icon: <LogOut size={20} />,
      active: isNavItemActive(pathname, '/sign-out'),
      position: 'bottom',
    },
  ];
};
