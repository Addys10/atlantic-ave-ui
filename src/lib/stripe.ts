import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.stripeSecretKey(), {
  apiVersion: '2023-10-16' as any,
});
