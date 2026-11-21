import { createServerFn } from '@tanstack/react-start'
import { isMaintenanceMode } from '@/lib/maintenance'
import { getReleaseInfo } from './releases.server'

export const getSiteDataFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const maintenance = isMaintenanceMode()
    return {
      maintenance,
      releaseInfo: maintenance ? null : await getReleaseInfo(),
    }
  },
)
