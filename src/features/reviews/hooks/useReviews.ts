import { useMemo } from 'react';
import type { Topic } from '@/features/topics/types/topic.types';
import { getDueReviews, getAllScheduledReviews, getCompletedReviews } from '../services/reviewService';
import type { ReviewListItem } from '../types/review.types';

export function useDueReviews(topics: Topic[]): ReviewListItem[] {
    return useMemo(() => getDueReviews(topics), [topics]);
}

export function useAllScheduledReviews(topics: Topic[]): ReviewListItem[] {
    return useMemo(() => getAllScheduledReviews(topics), [topics]);
}

export function useCompletedReviews(topics: Topic[]): ReviewListItem[] {
    return useMemo(() => getCompletedReviews(topics), [topics]);
}