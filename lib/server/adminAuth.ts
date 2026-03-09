import 'server-only';

function getAdminUserIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS || '';
  const ids = raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return new Set(ids);
}

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return getAdminUserIds().has(userId);
}

export class AdminAuthError extends Error {
  constructor(message = 'Admin access required') {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export function assertAdmin(userId: string | null | undefined): void {
  if (!isAdmin(userId)) {
    throw new AdminAuthError();
  }
}
