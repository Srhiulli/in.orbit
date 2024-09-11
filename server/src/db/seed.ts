import { client, db } from '.'
import { goals, goalsCompletions } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Run 5k', desiredWeeklyFrequency: 1 },
      { title: 'Read 10 pages', desiredWeeklyFrequency: 2 },
      { title: 'Learn to code', desiredWeeklyFrequency: 3 },
    ])
    .returning()
  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalsCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
    { goalId: result[2].id, createdAt: startOfWeek.toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
