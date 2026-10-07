import type { Href } from 'expo-router';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';

import { AdminScreen, exitAdmin, PageTitle } from '@/components/admin';
import { Card, MenuRow } from '@/components/blocks';
import { Button } from '@/components/button';
import type { IconName } from '@/components/icon';
import { CUSTOMERS } from '@/data/catalog';
import { cnt, money } from '@/lib/format';
import { useApp, useVisibleCats } from '@/store/app-store';
import { enter } from '@/theme/motion';
import { useMotion } from '@/theme/use-theme';

export default function AdminMore() {
  const { reduced } = useMotion();
  const cats = useVisibleCats();
  const discounts = useApp((s) => s.discounts);
  const freeAt = useApp((s) => s.freeAt);

  const items: { href: Href; title: string; sub: string; icon: IconName }[] = [
    { href: '/admin/categories', title: 'Categories', sub: `${cats.length} visible`, icon: 'category' },
    { href: '/admin/customers', title: 'Customers', sub: cnt(CUSTOMERS.length, 'customer'), icon: 'group' },
    { href: '/admin/discounts', title: 'Discounts', sub: cnt(discounts.filter((d) => d.on).length, 'active code'), icon: 'sell' },
    { href: '/admin/shipping', title: 'Shipping', sub: `Free from ${money(freeAt)}`, icon: 'local_shipping' },
    { href: '/admin/reports', title: 'Reports', sub: 'Revenue, categories, top products', icon: 'bar_chart' },
    { href: '/admin/settings', title: 'Settings', sub: 'Store, payments, staff', icon: 'settings' },
  ];

  return (
    <AdminScreen title="Manage">
      <Animated.View entering={enter(0, reduced)}>
        <PageTitle title="Manage" />
      </Animated.View>
      <Animated.View entering={enter(1, reduced)}>
        <Card radius={20}>
          {items.map((m, i) => (
            <MenuRow key={m.title} tile="accent" icon={m.icon} title={m.title} sub={m.sub} last={i === items.length - 1} onPress={() => router.push(m.href)} />
          ))}
        </Card>
      </Animated.View>
      <Animated.View entering={enter(2, reduced)}>
        <Button label="Back to store" variant="outline" height={50} radius={16} weight={600} fontSize={14} onPress={exitAdmin} />
      </Animated.View>
    </AdminScreen>
  );
}
