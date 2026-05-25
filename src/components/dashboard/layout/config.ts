import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  {
    key: 'legacy-part-1',
    title: '统一图计算加速芯片架构',
    href: paths.dashboard.part1,
    icon: 'chart-pie',
    subItems: [{ key: 'content-1', title: '加速器性能展示', href: paths.dashboard.part1_sub1 }],
  },
  {
    key: 'midterm-part-1',
    title: '动态图计算加速器架构',
    href: paths.dashboard.part2,
    icon: 'chart-pie',
    subItems: [{ key: 'midterm', title: '加速器性能展示', href: paths.dashboard.part2_sub1 }],
  },
  {
    key: 'midterm-part-2',
    title: '自适应优化和部署工具',
    href: paths.dashboard.part3,
    icon: 'users',
    subItems: [{ key: 'midterm', title: '优化工具性能展示', href: paths.dashboard.part3_sub1 }],
  },
  {
    key: 'midterm-part-3',
    title: '异构运行时',
    href: paths.dashboard.part4,
    icon: 'plugs-connected',
    subItems: [
      { key: 'graph-update', title: '图更新性能展示', href: paths.dashboard.part4_sub1 },
      { key: 'graph-algorithm', title: '图算法性能展示', href: paths.dashboard.part4_sub2 },
    ],
  },
  {
    key: 'midterm-part-4',
    title: '高层编程抽象',
    href: paths.dashboard.part5,
    icon: 'user',
    subItems: [{ key: 'midterm', title: '代码压缩效果展示', href: paths.dashboard.part5_sub1 }],
  },
] satisfies NavItemConfig[];
