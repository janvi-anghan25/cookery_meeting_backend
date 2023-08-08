import Stripe from 'stripe';
import { constants as APP_CONST } from '../constant/stripe';

export const stripe = new Stripe(APP_CONST.STRIPE_SECRET_KEY);


