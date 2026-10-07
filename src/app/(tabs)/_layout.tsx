import { usePathname } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useEffect } from 'react';

import { GlassTabBar, type TabItem } from '@/components/tab-bar';
import { fadeTabRender } from '@/components/tab-slot-fade';
import { useUI } from '@/store/ui-store';

const TABS: TabItem[] = [
  { name: 'index', label: 'Home', icon: 'home', match: (p) => p === '/' },
  { name: 'shop', label: 'Shop', icon: 'grid_view', match: (p) => p.startsWith('/shop') },
  { name: 'wishlist', label: 'Wishlist', icon: 'favorite', match: (p) => p.startsWith('/wishlist') },
  { name: 'cart', label: 'Cart', icon: 'shopping_cart', match: (p) => p.startsWith('/cart') },
  { name: 'profile', label: 'Profile', icon: 'person', match: (p) => p.startsWith('/profile') },
];

export default function StoreTabsLayout() {
  const path = usePathname();
  const setLastTabPath = useUI((s) => s.setLastTabPath);
  useEffect(() => {
    if (TABS.some((t) => t.match(path))) setLastTabPath(path);
  }, [path, setLastTabPath]);

  return (
    <Tabs>
      <TabSlot renderFn={fadeTabRender} />
      {/* Route registry only — the visible bar is GlassTabBar below. */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="index" href="/" />
        <TabTrigger name="shop" href="/shop" />
        <TabTrigger name="wishlist" href="/wishlist" />
        <TabTrigger name="cart" href="/cart" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>
      <GlassTabBar items={TABS} />
    </Tabs>
  );
}
