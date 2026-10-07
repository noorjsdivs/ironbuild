import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

import { GlassTabBar, type TabItem } from '@/components/tab-bar';
import { fadeTabRender } from '@/components/tab-slot-fade';
import { useApp } from '@/store/app-store';

const TABS: TabItem[] = [
  { name: 'index', label: 'Dashboard', icon: 'dashboard', match: (p) => p === '/admin' },
  { name: 'orders', label: 'Orders', icon: 'receipt_long', match: (p) => p.startsWith('/admin/orders') },
  { name: 'products', label: 'Products', icon: 'inventory_2', match: (p) => p.startsWith('/admin/products') },
  { name: 'inventory', label: 'Inventory', icon: 'warehouse', match: (p) => p.startsWith('/admin/inventory') },
  { name: 'more', label: 'More', icon: 'more_horiz', match: (p) => p.startsWith('/admin/more') },
];

export default function AdminTabsLayout() {
  const newOrders = useApp((s) => s.orders.filter((o) => o.step === 0).length);
  return (
    <Tabs>
      <TabSlot renderFn={fadeTabRender} />
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="index" href="/admin" />
        <TabTrigger name="orders" href="/admin/orders" />
        <TabTrigger name="products" href="/admin/products" />
        <TabTrigger name="inventory" href="/admin/inventory" />
        <TabTrigger name="more" href="/admin/more" />
      </TabList>
      <GlassTabBar items={TABS} variant="admin" badges={{ orders: newOrders }} />
    </Tabs>
  );
}
