interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_GSC_VERIFICATION?: string;
  readonly PUBLIC_ENABLE_ANALYTICS?: string;
  readonly PUBLIC_ANALYTICS_ID?: string;
  readonly PUBLIC_ENABLE_ADS?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_NOINDEX_ALL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** 분석 이벤트 헬퍼. 분석이 꺼져 있으면 아무 동작도 하지 않는다. */
  cpTrack: (name: string, params?: Record<string, string | number>) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
