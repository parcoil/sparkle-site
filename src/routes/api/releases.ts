import { createFileRoute } from '@tanstack/react-router'
import { getPatchNotesFn } from '../../server/releases.functions'

export const Route = createFileRoute('/api/releases')({
  server: {
    handlers: {
      GET: async () => {
        const patchNotes = await getPatchNotesFn()

        if (patchNotes.length === 0) {
          return Response.json({ error: 'Failed to fetch releases' }, { status: 502 })
        }

        return Response.json(
          patchNotes.map((patch) => ({
            version: patch.version,
            date: patch.date,
            features: [],
            fixes: [],
            breaking: [],
            body: patch.body,
          })),
          {
            headers: {
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
          }
        )
      },
    },
  },
})
