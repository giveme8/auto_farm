/**
 * Simple UA-based mobile detection.
 * We prefer UA here to avoid false positives on desktop with narrow windows.
 */
export function isMobileUserAgent(ua: string) {
  return /android|iphone|ipad|ipod|mobile/i.test(ua);
}
