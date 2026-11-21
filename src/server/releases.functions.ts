import { createServerFn } from '@tanstack/react-start'
import { getPatchNotes, getReleaseInfo } from './releases.server'

export const getReleaseInfoFn = createServerFn({ method: 'GET' }).handler(
  async () => getReleaseInfo(),
)

export const getPatchNotesFn = createServerFn({ method: 'GET' }).handler(
  async () => getPatchNotes(),
)
