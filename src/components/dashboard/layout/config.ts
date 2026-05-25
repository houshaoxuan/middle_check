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
    key: 'legacy-part-2',
    title: '图计算加速卡',
    href: paths.dashboard.part2,
    icon: 'users',
    subItems: [
      { key: 'content-1', title: '模拟器数据集运行展示', href: paths.dashboard.part2_sub1 },
      { key: 'content-2', title: '模拟器基本原理展示', href: paths.dashboard.part2_sub2 },
    ],
  },
  {
    key: 'legacy-part-3',
    title: '图计算编程环境',
    href: paths.dashboard.part3,
    icon: 'plugs-connected',
    subItems: [
      { key: 'content-1', title: '编程模型框架', href: paths.dashboard.part3_sub1 },
      { key: 'content-2', title: '框架转换', href: paths.dashboard.part3_sub2 },
      { key: 'content-3', title: '动态图数据管理', href: paths.dashboard.part3_sub3 },
    ],
  },
  {
    key: 'legacy-part-4',
    title: '泛图计算典型应用',
    href: paths.dashboard.part4,
    icon: 'user',
    subItems: [
      { key: 'content-1', title: '面向不同场景的数据清洗', href: paths.dashboard.part4_sub1 },
      { key: 'content-2', title: '数据清洗中间结果', href: paths.dashboard.part4_sub2 },
      { key: 'content-3', title: '金融应用示例展示', href: paths.dashboard.part4_sub3 },
    ],
  },
  {
    key: 'midterm-part-1',
    title: '高性能动态图计算加速器架构',
    href: paths.dashboard.part5,
    icon: 'chart-pie',
    subItems: [{ key: 'midterm', title: '中期验收展示', href: paths.dashboard.part5_sub1 }],
  },
  {
    key: 'midterm-part-2',
    title: '多维指标敏感的加速器自适应优化和部署工具',
    href: paths.dashboard.part6,
    icon: 'users',
    subItems: [{ key: 'midterm', title: '中期验收展示', href: paths.dashboard.part6_sub1 }],
  },
  {
    key: 'midterm-part-3',
    title: '面向动态图计算的异构运行时',
    href: paths.dashboard.part7,
    icon: 'plugs-connected',
    subItems: [{ key: 'midterm', title: '中期验收展示', href: paths.dashboard.part7_sub1 }],
  },
  {
    key: 'midterm-part-4',
    title: '面向动态图计算的高层编程抽象与应用验证',
    href: paths.dashboard.part8,
    icon: 'user',
    subItems: [{ key: 'midterm', title: '中期验收展示', href: paths.dashboard.part8_sub1 }],
  },
  {
    key: 'template',
    title: '中期指标展示模板',
    href: paths.dashboard.part9,
    icon: 'gear-six',
    subItems: [{ key: 'midterm-template', title: '通用指标展示页面', href: paths.dashboard.part9_sub1 }],
  },
] satisfies NavItemConfig[];
