import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Card, Photo } from '@/components/blocks';
import { Segmented } from '@/components/controls';
import { ProgressBar } from '@/components/progress-bar';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { money } from '@/lib/format';
import { useVisibleCats } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

type Range = '7d' | '30d' | '90d';
/** Seed orders cover ~a week; longer ranges are extrapolated for the demo. */
const FACTOR: Record<Range, number> = { '7d': 1, '30d': 3.6, '90d': 9.8 };

export default function AdminReports() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const cats = useVisibleCats();
  const { active, revenue, byId } = useAdminStats();
  const [range, setRange] = useState<Range>('30d');
  const rf = FACTOR[range];

  const byCat = useMemo(() => {
    const rows = cats
      .map((name) => ({
        name,
        v: active.reduce((a, o) => a + o.items.reduce((b, i) => (byId(i.id)?.cat === name ? b + (byId(i.id)?.prices[i.s] ?? 0) * i.q : b), 0), 0) * rf,
      }))
      .filter((r) => r.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, 6);
    return { rows, max: Math.max(1, ...rows.map((r) => r.v)) };
  }, [cats, active, byId, rf]);

  const top = useMemo(() => {
    const units = new Map<string, number>();
    active.forEach((o) => o.items.forEach((i) => units.set(i.id, (units.get(i.id) ?? 0) + i.q)));
    return [...units.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [active]);

  return (
    <AdminScreen title="Reports" back>
      <Animated.View entering={enter(0, reduced)}>
        <Segmented<Range>
          height={42}
          value={range}
          onChange={setRange}
          options={[
            { value: '7d', label: '7 days' },
            { value: '30d', label: '30 days' },
            { value: '90d', label: '90 days' },
          ]}
        />
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row', gap: 10 }}>
        {[
          ['Revenue', money(revenue * rf)],
          ['Orders', String(Math.round(active.length * rf))],
        ].map(([l, v]) => (
          <Card key={l} style={{ flex: 1, padding: 14, gap: 8 }}>
            <Text style={[font.mono(500, 9.5, { ls: 0.08, upper: true }), { color: c.text3 }]}>{l}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={[font.num(800, 28), { color: c.text1 }]}>
              {v}
            </Text>
          </Card>
        ))}
      </Animated.View>
      <Animated.View entering={enter(2, reduced)}>
        <Card radius={20} style={{ padding: 16, gap: 12 }}>
          <Text style={[font.display(700, 18), { color: c.text1 }]}>Revenue by category</Text>
          {byCat.rows.map((r, i) => (
            <View key={r.name} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[font.body(500, 12.5), { color: c.text1 }]}>{r.name}</Text>
                <Text style={[font.mono(500, 12.5), { color: c.text2 }]}>{money(r.v)}</Text>
              </View>
              <ProgressBar pct={(r.v / byCat.max) * 100} duration={800} delay={200 + i * 70} />
            </View>
          ))}
        </Card>
      </Animated.View>
      <Animated.View entering={enter(3, reduced)}>
        <Card radius={20} style={{ padding: 16, gap: 10 }}>
          <Text style={[font.display(700, 18), { color: c.text1 }]}>Top products</Text>
          {top.map(([id, u], i) => {
            const p = byId(id);
            if (!p) return null;
            return (
              <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderBottomWidth: i === top.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
                <Text style={[font.mono(700, 12), { width: 18, color: c.text3 }]}>{String(i + 1).padStart(2, '0')}</Text>
                <View style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', backgroundColor: c.surface2 }}>
                  <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text numberOfLines={1} style={[font.body(600, 13.5), { flex: 1, color: c.text1 }]}>
                  {p.name}
                </Text>
                <Text style={[font.mono(600, 12), { color: c.text2 }]}>{`${Math.round(u * rf)} sold`}</Text>
              </View>
            );
          })}
        </Card>
      </Animated.View>
    </AdminScreen>
  );
}
