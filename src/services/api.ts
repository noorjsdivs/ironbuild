/**
 * Service layer. These functions are the seam where a real backend plugs in:
 * today they simulate latency and resolve against the local store, so the
 * UI already handles loading states the way it will in production.
 */
import { ME } from '@/data/catalog';
import type { Order, User } from '@/data/types';
import { addDays, clock, shortDate } from '@/lib/format';
import { useApp } from '@/store/app-store';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type AuthApi = {
  signIn(email: string, password: string): Promise<User>;
  register(name: string, email: string, password: string): Promise<void>;
  sendResetCode(email: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<boolean>;
  socialSignIn(provider: 'apple' | 'google'): Promise<User>;
};

const DEMO_USER: User = { name: 'Sam Rivera', email: 'sam.rivera@mail.com' };

export const auth: AuthApi = {
  async signIn(email) {
    await wait(900);
    return { ...DEMO_USER, email: email.trim().toLowerCase() || DEMO_USER.email };
  },
  async register() {
    await wait(800);
  },
  async sendResetCode() {
    await wait(800);
  },
  async verifyCode(_email, code) {
    await wait(900);
    return /^\d{6}$/.test(code);
  },
  async socialSignIn() {
    await wait(900);
    return DEMO_USER;
  },
};

export type PlaceOrderInput = { express: boolean; payLabel: string };

export const orders = {
  /** Charges the selected method and creates the order from the current cart. */
  async place({ express, payLabel }: PlaceOrderInput): Promise<Order> {
    await wait(1500);
    const s = useApp.getState();
    const now = new Date();
    const no = 'IB-' + (20425 + s.orders.length * 7);
    const order: Order = {
      no,
      cid: ME,
      date: shortDate(now),
      step: 0,
      items: s.cart.map((c) => ({ ...c })),
      ship: express ? 'exp' : 'std',
      pay: payLabel,
      times: [`Today, ${clock(now)}`],
      etaShort: express ? 'Tomorrow' : `${shortDate(addDays(now, 3))} – ${addDays(now, 5).getDate()}`,
    };
    s.addOrder(order);
    s.clearCart();
    return order;
  },
};
