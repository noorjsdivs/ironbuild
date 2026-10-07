import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { ToggleRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { LinkButton, useBottomGap } from '@/components/chrome';
import { RadioCard } from '@/components/controls';
import { Slider } from '@/components/slider';
import { SORT_LABELS, useShopResults } from '@/hooks/use-shop-results';
import { cnt, money } from '@/lib/format';
import { DEFAULT_FILTERS, useUI, type ShopFilters } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

/** Native form sheet: sort, max price and sale filters, applied on confirm. */
export default function FiltersSheet() {
  const { c } = useTheme();
  const applied = useUI((s) => s.filters);
  const setFilters = useUI((s) => s.setFilters);
  const [draft, setDraft] = useState<ShopFilters>(applied);
  const results = useShopResults(draft);
  const bottom = useBottomGap(20);
  // iOS sheets float above the home indicator; Android sheets sit on the edge.
  const padBottom = Platform.OS === 'ios' ? 20 : bottom + 10;
  const patch = (p: Partial<ShopFilters>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <View style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: padBottom, gap: 12, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
        <Text accessibilityRole="header" style={[font.display(800, 28), { color: c.text1 }]}>
          Filters
        </Text>
        <LinkButton mono label="Reset" onPress={() => setDraft(DEFAULT_FILTERS)} />
      </View>

      <Text style={[font.eyebrow(), { color: c.text3 }]}>Sort by</Text>
      <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
        {SORT_LABELS.map((l, i) => (
          <RadioCard key={l} title={l} on={draft.sort === i} onPress={() => patch({ sort: i as ShopFilters['sort'] })} height={50} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
        <Text style={[font.eyebrow(), { color: c.text3 }]}>Max price</Text>
        <Text style={[font.mono(600, 13), { color: c.text1 }]}>{draft.max >= 1000 ? 'Any price' : 'Up to ' + money(draft.max)}</Text>
      </View>
      <Slider label="Maximum price" min={20} max={1000} step={10} value={draft.max} onChange={(max) => patch({ max })} />

      <View style={{ borderRadius: 15, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, overflow: 'hidden' }}>
        <ToggleRow title="On sale only" on={draft.sale} onToggle={() => patch({ sale: !draft.sale })} last compact />
      </View>

      <Button
        label={`Show ${cnt(results.length, 'result')}`}
        style={{ marginTop: 6 }}
        onPress={() => {
          setFilters(draft);
          router.back();
        }}
      />
    </View>
  );
}
