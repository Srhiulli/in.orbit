import {goals, goalsCompletions } from '../db/schema'
import { db } from '../db'
import { count, and, gte, lte, eq,sql } from 'drizzle-orm'
import dayjs from 'dayjs'

interface CreateGoalCompletionRequest {
 goalId:string
}

export async function CreateGoalCompletion({
    goalId
}: CreateGoalCompletionRequest) {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCompletionCount = db.$with('goals_completion_counts').as(
        db.select({
          goalId: goalsCompletions.goalId,
          completionCount: count(goalsCompletions.id)
          .as('completionCount')
        })
        .from(goalsCompletions)
        .where(and(
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          eq(goalsCompletions.goalId, goalId)
        ))
        .groupBy(goalsCompletions.goalId)
      )

  const result = await db
  .with(goalsCompletionCount)
  .select({
    desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    completionCount: sql `
    COALESCE(${goalsCompletionCount.completionCount}, 0)
    `.mapWith(Number)
  })
  .from(goals)
  .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
  .where(eq(goals.id, goalId))


  const {completionCount, desiredWeeklyFrequency} = result[0]
  if(completionCount >= desiredWeeklyFrequency){
    throw new Error('Goal already completed for this week')
  }
    const insertResult = await db
    .insert(goalsCompletions)
    .values({
      goalId
    })
    .returning()
    const goalCompletion = insertResult[0]


  return {
    goalCompletion,
  }
}
