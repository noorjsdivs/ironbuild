import { Card, SectionLabel, ToggleRow } from '@/components/blocks';
import { PushedScreen } from '@/components/screen';
import { useApp } from '@/store/app-store';
import type { NotifPrefs } from '@/store/slices';

const ROWS: [keyof NotifPrefs, string, string][] = [
  ['ship', 'Order updates', 'Shipped, out for delivery, delivered'],
  ['promo', 'Offers & drops', 'Sales, new gear, restocks you follow'],
  ['stock', 'Back in stock', 'Wishlist items available again'],
  ['review', 'Review reminders', 'A week after delivery'],
];

export default function NotificationsScreen() {
  const prefs = useApp((s) => s.notifPrefs);
  const toggle = useApp((s) => s.toggleNotifPref);
  return (
    <PushedScreen title="Notifications">
      <SectionLabel>Push notifications</SectionLabel>
      <Card>
        {ROWS.map(([k, title, sub], i) => (
          <ToggleRow key={k} title={title} sub={sub} on={prefs[k]} onToggle={() => toggle(k)} last={i === ROWS.length - 1} />
        ))}
      </Card>
    </PushedScreen>
  );
}
