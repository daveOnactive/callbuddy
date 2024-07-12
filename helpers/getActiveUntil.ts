export function getActiveUntil(lastLogin: string) {
  if (!lastLogin) return;

  const currentDateTime = new Date(lastLogin);
  const activeUntil = new Date(currentDateTime.getTime() + 3 * 60 * 1000);

  return activeUntil;
}
