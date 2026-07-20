const REQUIRED_AUTH_VARIABLES = [
  'AUTH_USER',
  'AUTH_PASS',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

const INSECURE_VALUES = new Set([
  'decoproject2024',
  'access-secret',
  'refresh-secret',
  'decoproject-access-secret-key',
  'decoproject-refresh-secret-key',
]);

export function getRequiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

export function validateRuntimeEnvironment(): void {
  for (const name of REQUIRED_AUTH_VARIABLES) {
    const value = getRequiredEnvironment(name);
    if (name !== 'AUTH_USER' && INSECURE_VALUES.has(value)) {
      throw new Error(`La variable ${name} usa un valor inseguro`);
    }
    if (name.startsWith('JWT_') && value.length < 32) {
      throw new Error(`La variable ${name} debe tener al menos 32 caracteres`);
    }
  }
}
