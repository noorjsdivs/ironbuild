import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Card, Photo, ToggleRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { BottomBar } from '@/components/chrome';
import { Chip } from '@/components/controls';
import { haptic } from '@/components/pressable-scale';
import { CAT_IMG, CATS } from '@/data/catalog';
import type { Category } from '@/data/types';
import { minPrice } from '@/lib/pricing';
import { useApp, useProduct } from '@/store/app-store';
import type { ProductDraft } from '@/store/slices';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

function LabeledInput({ label, value, onChangeText, numeric, placeholder }: { label: string; value: string; onChangeText: (v: string) => void; numeric?: boolean; placeholder?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={[font.eyebrow(), { color: c.text3 }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.text3}
        selectionColor={c.accentText}
        keyboardType={numeric ? 'number-pad' : 'default'}
        style={[numeric ? font.mono(600, 15) : font.body(500, 15), { height: 50, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, color: c.text1, paddingHorizontal: 14 }]}
      />
    </View>
  );
}

export default function AdminEditProduct() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { reduced } = useMotion();
  const existing = useProduct(id === 'new' ? undefined : id);
  const saveProduct = useApp((s) => s.saveProduct);
  const deleteProduct = useApp((s) => s.deleteProduct);

  const [name, setName] = useState(existing?.name ?? '');
  const [price, setPrice] = useState(existing ? String(minPrice(existing)) : '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '');
  const [cat, setCat] = useState<Category>(existing?.cat ?? 'Dumbbells');
  const [active, setActive] = useState(existing?.active ?? true);
  const img = existing?.img ?? CAT_IMG[cat];

  const save = () => {
    if (!name.trim()) {
      haptic('warning');
      return toast('Name required', 'Give the product a name first');
    }
    const draft: ProductDraft = { name, price: Math.max(0, parseInt(price, 10) || 0), stock: Math.max(0, parseInt(stock, 10) || 0), cat, active };
    saveProduct(existing?.id ?? null, draft);
    haptic('success');
    toast(existing ? 'Product saved' : 'Product created', name.trim());
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('Delete product?', `${existing.name} will be removed from the store, carts and wishlists.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProduct(existing.id);
          toast('Product deleted', existing.name);
          router.back();
        },
      },
    ]);
  };

  return (
    <AdminScreen
      title="Product"
      back
      bottomSpace={150}
      footer={
        <BottomBar style={{ flexDirection: 'row', gap: 10, paddingTop: 12 }}>
          {existing ? <Button label="Delete" variant="danger" height={54} radius={16} weight={600} fontSize={14} style={{ paddingHorizontal: 18 }} onPress={remove} /> : null}
          <Button label={existing ? 'Save changes' : 'Create product'} height={54} radius={16} fontSize={14.5} style={{ flex: 1 }} onPress={save} />
        </BottomBar>
      }>
      <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <View style={{ width: 96, height: 96, borderRadius: 20, overflow: 'hidden', backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line }}>
          <Photo uri={img} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={[font.display(800, 24), { color: c.text1 }]}>{existing ? 'Edit product' : 'New product'}</Text>
          <Text style={[font.mono(500, 11), { color: c.text3 }]}>{existing?.sku ?? 'New SKU'}</Text>
          <Button
            label="Replace photo"
            variant="outline"
            height={32}
            radius={10}
            weight={600}
            fontSize={12}
            style={{ alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 12 }}
            onPress={() => toast('Photo picker', 'Choose from library or camera')}
          />
        </View>
      </Animated.View>

      <Animated.View entering={enter(1, reduced)}>
        <LabeledInput label="Name" value={name} onChangeText={setName} placeholder="Product name" />
      </Animated.View>
      <Animated.View entering={enter(2, reduced)} style={{ flexDirection: 'row', gap: 10 }}>
        <LabeledInput label="Price ($)" value={price} onChangeText={(v) => setPrice(v.replace(/\D/g, ''))} numeric placeholder="0" />
        <LabeledInput label="Stock" value={stock} onChangeText={(v) => setStock(v.replace(/\D/g, ''))} numeric placeholder="0" />
      </Animated.View>

      <Animated.View entering={enter(3, reduced)} style={{ gap: 8 }}>
        <Text style={[font.eyebrow(), { color: c.text3 }]}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATS.map((cc) => (
            <Chip key={cc} label={cc} height={36} on={cat === cc} onPress={() => setCat(cc)} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={enter(4, reduced)}>
        <Card>
          <ToggleRow title="Published" sub="Visible in the store" on={active} onToggle={() => setActive((a) => !a)} last />
        </Card>
      </Animated.View>
    </AdminScreen>
  );
}
