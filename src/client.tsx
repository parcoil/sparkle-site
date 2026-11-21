import { StartClient } from '@tanstack/react-start/client'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import posthog from 'posthog-js'

posthog.init('phc_pXPMfdpgrBN9eT7hFmaRZIzLJuC87f3KeCwdlMi5p2W', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2025-11-30',
})

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
)
