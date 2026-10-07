import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { Photo } from '@/components/blocks';
import { ScreenStatusBar } from '@/components/chrome';
import { Icon } from '@/components/icon';
import { Barbell } from '@/components/intro/barbell';
import { FadeCopy, SlideHeadline } from '@/components/intro/slide-copy';
import { PagerDots } from '@/components/pager-dots';
import { haptic, PressableScale } from '@/components/pressable-scale';
import { PulseRing } from '@/components/pulse-ring';
import { ONBOARDING } from '@/data/catalog';
import { withAlpha } from '@/lib/color';
import { firstName } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { EASE_IO, EASE_OUT, EASE_OUT_STRONG } from '@/theme/motion';
import { FIXED } from '@/theme/tokens';
import { useMotion, useTheme } from '@/theme/use-theme';

const ON_PHOTO_DIM = 'rgba(243,243,239,0.6)';

/** Stage timeline (ms after mount): bar → plates → slam → reveal → onboarding. */
const T = { bar: 0, plates: 560, slam: 1480, slamEnd: 1600, reveal: 2350, chrome: 3050 };

function Letter({ ch, i, on, accent }: { ch: string; i: number; on: boolean; accent: boolean }) {
  const { c } = useTheme();
  const p = useSharedValue(0);
  useEffect(() => {
    if (on) p.set(withDelay(140 + i * 38, withTiming(1, { duration: 700, easing: EASE_OUT_STRONG })));
  }, [on, i, p]);
  const style = useAnimatedStyle(() => ({ opacity: Math.min(1, p.get() * 2.5), transform: [{ translateY: (1 - p.get()) * 50 }] }));
  return <Animated.Text style={[font.display(800, 46, { ls: 0.03 }), { color: accent ? c.accent : FIXED.onPhoto }, style]}>{ch}</Animated.Text>;
}

export default function WelcomeScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const user = useApp((s) => s.user);
  const markIntroSeen = useApp((s) => s.markIntroSeen);

  const [stage, setStage] = useState(reduced ? 5 : 0);
  const [slam, setSlam] = useState(0);
  const [kg, setKg] = useState(reduced ? 140 : 0);
  const [ob, setOb] = useState(0);
  const [moved, setMoved] = useState(false);
  const [ctaW, setCtaW] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef(stage);

  const toStage = (n: number) => {
    if (stageRef.current >= n) return;
    stageRef.current = n;
    setStage(n);
  };

  useEffect(() => {
    void SplashScreen.hideAsync();
    if (reduced) return;
    const at = (t: number, fn: () => void) => timers.current.push(setTimeout(fn, 120 + t));
    at(T.bar, () => toStage(1));
    at(T.plates, () => toStage(2));
    for (let k = 1; k <= 14; k++) at(T.plates + 40 + k * 55, () => setKg((v) => Math.max(v, k * 10)));
    at(T.slam, () => {
      if (stageRef.current >= 3) return;
      toStage(3);
      setSlam((n) => n + 1);
      haptic('medium');
    });
    at(T.reveal, () => toStage(4));
    at(T.chrome, () => toStage(5));
    const list = timers.current;
    return () => list.forEach(clearTimeout);
    // Runs once: the intro timeline is fire-and-forget.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipIntro = () => {
    timers.current.forEach(clearTimeout);
    setKg(140);
    toStage(5);
  };

  const leave = (to: 'login' | 'register') => {
    markIntroSeen();
    if (user) router.back();
    else router.replace(to === 'login' ? '/login' : '/register');
  };

  const goSlide = (i: number) => {
    setOb(Math.max(0, Math.min(ONBOARDING.length - 1, i)));
    setMoved(true);
  };

  const k = { s1: stage >= 1, s2: stage >= 2, s3: stage >= 3, s4: stage >= 4, s5: stage >= 5 };
  const last = ob === ONBOARDING.length - 1;

  /* ───── animated layers ───── */
  const reveal = useSharedValue(reduced ? 1 : 0);
  const glow = useSharedValue(0);
  const lock = useSharedValue(reduced ? 1 : 0);
  const chrome = useSharedValue(reduced ? 1 : 0);
  const kgOp = useSharedValue(0);
  const cta = useSharedValue(0);

  useEffect(() => {
    if (k.s4) reveal.set(withTiming(1, { duration: reduced ? 0 : 1150, easing: EASE_IO }));
    if (k.s4) lock.set(withTiming(1, { duration: reduced ? 0 : 950, easing: EASE_IO }));
    glow.set(withTiming(k.s2 && !k.s4 ? 1 : 0, { duration: 700, easing: EASE_OUT }));
    kgOp.set(withTiming(k.s2 && !k.s3 ? 1 : 0, { duration: 260 }));
    if (k.s5) chrome.set(withDelay(reduced ? 0 : 300, withTiming(1, { duration: reduced ? 0 : 500, easing: EASE_OUT })));
  }, [k.s2, k.s3, k.s4, k.s5, reveal, lock, glow, kgOp, chrome, reduced]);

  useEffect(() => {
    cta.set(withTiming(last ? 1 : 0, { duration: reduced ? 0 : 620, easing: EASE_IO }));
  }, [last, cta, reduced]);

  const revealStyle = useAnimatedStyle(() => {
    const r = 1 - reveal.get();
    return {
      opacity: Math.min(1, reveal.get() * 4),
      top: H * 0.46 * r,
      bottom: H * 0.46 * r,
      left: W * 0.12 * r,
      right: W * 0.12 * r,
      borderRadius: 48 * r,
    };
  });
  const revealInner = useAnimatedStyle(() => {
    const r = 1 - reveal.get();
    return { top: -H * 0.46 * r, left: -W * 0.12 * r };
  });
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.get(), transform: [{ scale: 0.5 + glow.get() * 0.5 }] }));
  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -lock.get() * H * (322 / 844) }, { scale: 1 - lock.get() * 0.5 }],
  }));
  const kgStyle = useAnimatedStyle(() => ({ opacity: kgOp.get() }));
  const topChrome = useAnimatedStyle(() => ({ opacity: chrome.get(), transform: [{ translateY: (1 - chrome.get()) * -8 }] }));
  const e0 = useAnimatedStyle(() => ({ opacity: chrome.get(), transform: [{ translateY: (1 - chrome.get()) * 16 }] }));
  const e1 = useAnimatedStyle(() => ({ opacity: chrome.get(), transform: [{ translateY: (1 - chrome.get()) * 20 }] }));
  const e2 = useAnimatedStyle(() => ({ opacity: chrome.get(), transform: [{ translateY: (1 - chrome.get()) * 24 }] }));
  const ctaStyle = useAnimatedStyle(() => ({ width: 60 + (Math.max(60, ctaW) - 60) * cta.get() }));
  const ctaLabel = useAnimatedStyle(() => ({ opacity: cta.get(), transform: [{ translateX: (1 - cta.get()) * -12 }] }));
  const segStyle = useAnimatedStyle(() => ({ opacity: 1 - cta.get() }));

  const swipe = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((e) => {
      if (e.translationX < -40) scheduleOnRN(goSlide, ob + 1);
      else if (e.translationX > 40) scheduleOnRN(goSlide, ob - 1);
    })
    .enabled(k.s5);

  return (
    <GestureDetector gesture={swipe}>
      <View style={{ flex: 1, backgroundColor: FIXED.splashBg }}>
        <ScreenStatusBar style="light" />

        {/* Photo reveal (CSS clip-path inset → full bleed) */}
        <Animated.View style={[{ position: 'absolute', overflow: 'hidden' }, revealStyle]}>
          <Animated.View style={[{ position: 'absolute', width: W, height: H }, revealInner]}>
            {ONBOARDING.map((s, i) => (
              <KenBurns key={s.img} uri={s.img} on={i === ob} revealed={k.s4} />
            ))}
            <LinearGradient
              colors={['rgba(8,9,11,0.7)', 'rgba(8,9,11,0.1)', 'rgba(8,9,11,0.35)', FIXED.splashBg]}
              locations={[0, 0.28, 0.48, 0.76]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>

        {/* Accent glow behind the bar */}
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: W / 2 - 210, top: H / 2 - 230, width: 420, height: 420 }, glowStyle]}>
          <Svg width={420} height={420}>
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={c.accent} stopOpacity={0.3} />
                <Stop offset="1" stopColor={c.accent} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={210} cy={210} r={210} fill="url(#glow)" />
          </Svg>
        </Animated.View>

        {/* Barbell + wordmark lockup */}
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: H / 2 - 96, alignItems: 'center', gap: 16 }, lockStyle]}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {slam > 0 && stage === 3 ? (
              <View key={slam} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                <PulseRing size={180} duration={900} repeat={false} />
              </View>
            ) : null}
            <Barbell stage={stage} slam={slam} />
          </View>
          <View style={{ width: 320, height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <View accessibilityRole="header" accessibilityLabel="IRONBUILD" style={{ flexDirection: 'row', overflow: 'hidden', height: 52, alignItems: 'center' }}>
              {'IRONBUILD'.split('').map((ch, i) => (
                <Letter key={i} ch={ch} i={i} on={k.s3} accent={i >= 4} />
              ))}
            </View>
            <Animated.View style={[StyleSheet.absoluteFill, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, kgStyle]}>
              <Text style={[font.mono(500, 12, { ls: 0.16, upper: true }), { color: ON_PHOTO_DIM }]}>Loading the bar</Text>
              <Text style={[font.mono(600, 12, { ls: 0.16 }), { color: c.accent }]}>{`${String(kg).padStart(3, '0')} KG`}</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Tap anywhere to skip the intro animation */}
        {!k.s5 ? <Pressable accessibilityLabel="Skip intro animation" style={StyleSheet.absoluteFill} onPress={skipIntro} /> : null}

        {/* Onboarding chrome */}
        <Animated.View pointerEvents={k.s5 ? 'box-none' : 'none'} style={[{ position: 'absolute', top: insets.top + 4, right: 20 }, topChrome]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => leave('login')}
            style={{ height: 36, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(20,22,26,0.42)', justifyContent: 'center' }}>
            <Text style={[font.body(600, 13), { color: FIXED.onPhoto }]}>Skip</Text>
          </Pressable>
        </Animated.View>

        <View pointerEvents={k.s5 ? 'box-none' : 'none'} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 20) + 14, gap: 16 }}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, e0]}>
            <Text style={[font.mono(600, 11, { ls: 0.08 }), { color: c.accent }]}>
              {`0${ob + 1}`}
              <Text style={{ color: 'rgba(243,243,239,0.4)' }}> / 03</Text>
            </Text>
            <View style={{ width: 24, height: 1, backgroundColor: 'rgba(243,243,239,0.3)' }} />
            <View style={{ flex: 1, height: 14 }}>
              {ONBOARDING.map((s, i) => (
                <FadeCopy key={s.eb} text={s.eb} on={k.s5 && i === ob} kind="eyebrow" />
              ))}
            </View>
          </Animated.View>

          <View style={{ height: 112 }} accessibilityLiveRegion="polite">
            {ONBOARDING.map((s, i) => (
              <SlideHeadline key={s.l0} l0={s.l0} l1={s.l1} pos={!k.s5 ? 1 : i === ob ? 0 : i < ob ? -1 : 1} moved={moved} />
            ))}
          </View>

          <View style={{ height: 46 }}>
            {ONBOARDING.map((s, i) => (
              <FadeCopy key={s.sub} text={s.sub} on={k.s5 && i === ob} kind="sub" />
            ))}
          </View>

          <Animated.View onLayout={(e) => setCtaW(e.nativeEvent.layout.width)} style={[{ height: 60, marginTop: 6, justifyContent: 'center' }, e1]}>
            <Animated.View style={segStyle} pointerEvents={last ? 'none' : 'auto'}>
              <PagerDots count={ONBOARDING.length} index={ob} onPick={goSlide} inactive="rgba(243,243,239,0.28)" size={8} activeSize={28} style={{ justifyContent: 'flex-start' }} />
            </Animated.View>
            <Animated.View style={[{ position: 'absolute', right: 0, top: 0, height: 60 }, ctaStyle]}>
              <PressableScale
                scaleTo={0.97}
                haptic="light"
                accessibilityLabel={last ? 'Get started' : 'Next slide'}
                onPress={() => (last ? leave('register') : goSlide(ob + 1))}
                style={{ flex: 1, borderRadius: 20, backgroundColor: c.accent, overflow: 'hidden', boxShadow: `0 12px 34px ${withAlpha(c.accent, 0.35)}` }}>
                <Animated.View style={[{ position: 'absolute', left: 22, top: 0, bottom: 0, justifyContent: 'center' }, ctaLabel]}>
                  <Text numberOfLines={1} style={[font.body(700, 16), { color: c.accentInk }]}>
                    Get started
                  </Text>
                </Animated.View>
                <View style={{ position: 'absolute', right: 9, top: 9, width: 42, height: 42, borderRadius: 14, backgroundColor: c.accentInk, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="arrow_forward" size={20} color={c.accent} />
                </View>
              </PressableScale>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }, e2]}>
            <Text style={[font.body(500, 13.5), { color: ON_PHOTO_DIM }]}>{user ? `Signed in as ${firstName(user.name)} ·` : 'Already have an account?'}</Text>
            <Pressable accessibilityRole="button" onPress={() => leave('login')} style={{ height: 44, paddingHorizontal: 4, justifyContent: 'center' }}>
              <Text style={[font.body(600, 13.5), { color: FIXED.onPhoto, textDecorationLine: 'underline' }]}>{user ? 'Continue' : 'Sign in'}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

/** Onboarding photo: cross-fades in and slowly settles from 1.14× scale. */
function KenBurns({ uri, on, revealed }: { uri: string; on: boolean; revealed: boolean }) {
  const op = useSharedValue(on ? 1 : 0);
  const scale = useSharedValue(1.14);
  useEffect(() => {
    op.set(withTiming(on ? 1 : 0, { duration: 900, easing: EASE_OUT }));
    scale.set(withTiming(on && revealed ? 1 : 1.14, { duration: on && revealed ? 8000 : 900, easing: EASE_OUT }));
  }, [on, revealed, op, scale]);
  const style = useAnimatedStyle(() => ({ opacity: op.get(), transform: [{ scale: scale.get() }] }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Photo uri={uri} style={{ width: '100%', height: '100%' }} />
    </Animated.View>
  );
}
