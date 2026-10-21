import type { ReviewHistoryItem, Topic, ReviewListItem } from '../types/review.types';
import { REVIEW_INTERVALS_DAYS } from '../types/review.types';

const FIRST_REVIEW_HOURS = 14;

function toUTCMidnight(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function getReviewStage(reviewHistory: ReviewHistoryItem[] | undefined): number {
    return reviewHistory?.length || 0;
}

export function calculateNextReviewDate(
    fromDate: Date,
    reviewHistory: ReviewHistoryItem[] | undefined
): Date | null {
    const stage = getReviewStage(reviewHistory);
    if (stage >= REVIEW_INTERVALS_DAYS.length) return null;

    if (stage === 0) {
        return new Date(fromDate.getTime() + FIRST_REVIEW_HOURS * 60 * 60 * 1000);
    }

    const days = REVIEW_INTERVALS_DAYS[stage];
    const next = toUTCMidnight(fromDate);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

export function isReviewFinished(reviewHistory: ReviewHistoryItem[] | undefined): boolean {
    return getReviewStage(reviewHistory) >= REVIEW_INTERVALS_DAYS.length;
}

function daysBetweenUTC(from: Date, to: Date): number {
    const fromUTC = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const toUTC = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((toUTC - fromUTC) / (1000 * 60 * 60 * 24));
}

export function getDueReviews(topics: Topic[], now: Date = new Date()): ReviewListItem[] {
    const due: ReviewListItem[] = [];

    for (const topic of topics) {
        for (const content of topic.contents) {
            const nextReviewDate = content.studyData?.nextReviewDate;
            if (!nextReviewDate) continue;

            const nextDate = new Date(nextReviewDate);
            if (nextDate.getTime() > now.getTime()) continue;

            due.push({
                topicId: topic.id,
                topicName: topic.name,
                contentId: content.id,
                contentTitle: content.title,
                nextReviewDate: nextDate,
                daysOverdue: Math.max(0, daysBetweenUTC(nextDate, now)),
                stage: getReviewStage(content.studyData?.reviewHistory),
                reviewCount: content.studyData?.reviewHistory?.length || 0
            });
        }
    }

    return due.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export function getAllScheduledReviews(topics: Topic[]): ReviewListItem[] {
    const all: ReviewListItem[] = [];

    for (const topic of topics) {
        for (const content of topic.contents) {
            const nextReviewDate = content.studyData?.nextReviewDate;
            if (!nextReviewDate) continue;

            const nextDate = new Date(nextReviewDate);
            all.push({
                topicId: topic.id,
                topicName: topic.name,
                contentId: content.id,
                contentTitle: content.title,
                nextReviewDate: nextDate,
                daysOverdue: 0,
                stage: getReviewStage(content.studyData?.reviewHistory),
                reviewCount: content.studyData?.reviewHistory?.length || 0
            });
        }
    }

    return all.sort((a, b) => (a.nextReviewDate?.getTime() || 0) - (b.nextReviewDate?.getTime() || 0));
}

export function getCompletedReviews(topics: Topic[]): ReviewListItem[] {
    const completed: ReviewListItem[] = [];

    for (const topic of topics) {
        for (const content of topic.contents) {
            const history = content.studyData?.reviewHistory;
            if (!history || history.length === 0) continue;

            const nextReviewDate = content.studyData?.nextReviewDate;
            completed.push({
                topicId: topic.id,
                topicName: topic.name,
                contentId: content.id,
                contentTitle: content.title,
                nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
                daysOverdue: 0,
                stage: getReviewStage(history),
                reviewCount: history.length
            });
        }
    }

    return completed.sort((a, b) => b.reviewCount - a.reviewCount);
}