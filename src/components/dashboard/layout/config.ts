import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: '课题一', title: '课题一', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: '课题二', title: '课题二', href: paths.dashboard.customers, icon: 'users' },
  { key: '课题三', title: '课题三', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: '课题四', title: '课题四', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: '课题五', title: '课题五', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
