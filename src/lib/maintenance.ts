/**
 * Maintenance mode is enabled by setting `MAT=true` in the environment.
 *
 * The check is a function so the value is read per request and can be toggled
 * at runtime (for example through a Docker environment variable) without
 * rebuilding the site.
 */
export function isMaintenanceMode(): boolean {
	const value = process.env.MAT ?? process.env.mat;

	if (!value) return false;

	return ['true', '1', 'yes'].includes(value.trim().toLowerCase());
}
