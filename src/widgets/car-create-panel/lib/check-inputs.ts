export function resolveName(value?: string): string {
  return value && value.trim() ? value : 'tesla';
}
export function resolveColor(value?: string): string {
  return value && value.trim() ? value : '#000000';
}
