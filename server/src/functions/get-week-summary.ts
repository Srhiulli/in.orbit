import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { goals, goalsCompletions } from "../db/schema";
import dayjs from "dayjs";
import { db } from "../db";

export async function getWeekSummary() {
	const lastDayOfWeek = dayjs().endOf("week").toDate();
	const firstDayOfWeek = dayjs().startOf("week").toDate();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);

	const goalsCompletedInWeek = db.$with("goals_completed_in_Week").as(
		db
			.select({
				id: goalsCompletions.id,
				title: goals.title,
				completedAt: goalsCompletions.createdAt,
				completedAtDate: sql`
            DATE(${goalsCompletions.createdAt})
            `.as("completedAtDate"),
			})
			.from(goalsCompletions)
			.innerJoin(goals, eq(goalsCompletions.goalId, goals.id))
			.orderBy(desc(goalsCompletions.createdAt))
			.where(
				and(
					gte(goalsCompletions.createdAt, firstDayOfWeek),
					lte(goalsCompletions.createdAt, lastDayOfWeek),
				),
			),
	);

	const goalsCompletedByWeekDay = db.$with("goals_completed_by_WeekDay").as(
		db
			.select({
				completedAtDate: goalsCompletedInWeek.completedAtDate,
				completions: sql`
          JSON_AGG(
          JSON_BUILD_OBJECT(
          'id', ${goalsCompletedInWeek.id},
          'title', ${goalsCompletedInWeek.title},
          'completedAt', ${goalsCompletedInWeek.completedAt}
          ))
          `.as("completions"),
			})
			.from(goalsCompletedInWeek)
			.groupBy(goalsCompletedInWeek.completedAtDate)
			.orderBy(desc(goalsCompletedInWeek.completedAtDate)),
	);

	type GoalsPerDay = Record<
		string,
		{
			id: string;
			title: string;
			completedAt: string;
		}[]
	>;

	const result = await db
		.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
		.select({
			completed: sql` (SELECT COUNT(*) FROM ${goalsCompletedInWeek}) `.mapWith(
				Number,
			),
			total:
				sql` (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek}) `.mapWith(
					Number,
				),
			goalsPerDay: sql<GoalsPerDay>`
          JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completedAtDate},
            ${goalsCompletedByWeekDay.completions}
          )
        `,
		})
		.from(goalsCompletedByWeekDay);

	return {
		summary: result[0],
	};
}
