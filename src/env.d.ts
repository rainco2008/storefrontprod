/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
import '@total-typescript/ts-reset';

declare global {
	interface ImportMetaEnv {
		readonly STRIPE_SECRET_KEY?: string;
		readonly US_SHIPPING_RATE_ID?: string;
		readonly INTERNATIONAL_SHIPPING_RATE_ID?: string;
		readonly GOOGLE_GEOLOCATION_SERVER_KEY?: string;
		readonly LOOPS_API_KEY?: string;
		readonly LOOPS_SHOP_TRANSACTIONAL_ID?: string;
		readonly LOOPS_FULFILLMENT_TRANSACTIONAL_ID?: string;
		readonly LOOPS_FULFILLMENT_EMAIL?: string;
		readonly SHOP_API_URL?: string;
		readonly SHOP_API_KEY?: string;
		readonly PUBLIC_FATHOM_SITE_ID?: string;
		readonly PUBLIC_GOOGLE_MAPS_BROWSER_KEY?: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}
