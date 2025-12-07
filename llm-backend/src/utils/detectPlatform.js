export function detectPlatform(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return 'unknown';
  }

  const host = u.hostname.replace('www.', '').toLowerCase();

  if (host.includes('youtube.com') || host.includes('youtu.be')) {
    return 'youtube';
  }
  if (host.includes('twitter.com') || host.includes('x.com')) {
    return 'twitter';
  }
  if (host.includes('instagram.com') || host.includes('instagr.am')) {
    return 'instagram';
  }

  return 'unknown';
}
