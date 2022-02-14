import { Magic } from 'magic-sdk';

export const m = typeof window !== 'undefined' ? new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY) : null;

