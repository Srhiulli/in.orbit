import { and, eq, gte, lte, sql } from "drizzle-orm"
import { goals, goalsCompletions } from "../db/schema"
import dayjs from "dayjs"
import { db } from "../db"

export async function getWeekSummary() {
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const firstDayOfWeek = dayjs().startOf('week').toDate()

    const goalsCreatedUpWeek = db.$with('goals_created_up_Week').as(
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
    const goalsCompletedInWeek = db.$with('goals_completed_in_Week').as(
        db.select({
          id : goalsCompletions.id,
          title : goals.title,
          completedAt: goalsCompletions.createdAt,
          completedAtDate: sql `
          DATE(${goalsCompletions.createdAt})
          `.as('completedAtDate')
        })
        .from(goalsCompletions)
        .innerJoin(goals, eq(goalsCompletions.goalId, goals.id)
        .where(and(
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          lte(goalsCompletions.createdAt, lastDayOfWeek)
        ))
      ))
      
    const goalsCompletedByWeekDay = db.$with('goals_completed_by_WeekDay').as(
        db
        .select({
          completedAtDate: goalsCompletedInWeek.completedAtDate,
          completions: sql `
          JSON_AGG(
          JSON_BUILD_OBJECT(
          'id', ${goalsCompletedInWeek.id},
          'title', ${goalsCompletedInWeek.title},
          'completedAt', ${goalsCompletedInWeek.completedAt}
          ))
          `.as('completions'), 
        })
        .from(goalsCompletedInWeek)
        .groupBy(goalsCompletedInWeek.completedAtDate)
      )

    const result = await db
      .with(goalsCreatedUpWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
      .select()
      .from(goalsCompletedByWeekDay)
    return {
        summary : result
    }
}