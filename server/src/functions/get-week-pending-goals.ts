import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
import { db } from '../db'
import { lte, count, gte, and, eq, sql } from 'drizzle-orm'
import { goals, goalsCompletions } from '../db/schema'

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goalsCreatedUpToWeek').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletionCount = db.$with('goals_completion_counts').as(
    db.select({
      goalId: goalsCompletions.goalId,
      completionCount: count(goalsCompletions.id)
      .as('completionCount')
    })
    .from(goalsCompletions)
    .where(and(
      gte(goalsCompletions.createdAt, firstDayOfWeek),
      lte(goalsCompletions.createdAt, lastDayOfWeek)
    ))
    .groupBy(goalsCompletions.goalId)
  )

  const pendingGoals = await db.with(goalsCreatedUpToWeek, goalsCompletionCount)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql `
      COALESCE(${goalsCompletionCount.completionCount}, 0)
      `.mapWith(Number)
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalsCompletionCount,
       eq(goalsCreatedUpToWeek.id, 
        goalsCompletionCount.goalId)) 

  return {
    pendingGoals, 
  }
}