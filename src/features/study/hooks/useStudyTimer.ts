import { useState, useEffect, useCallback, useRef } from 'react';
import { studyTimerService } from '../services/studyTimerService';
import type { UseStudyTimerProps } from '../types/study.types';

export function useStudyTimer({
    sessionKey,
    estimatedTime,
    onTimeUpdate,
    onMinuteTick
}: UseStudyTimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    const hasTarget = estimatedTime !== undefined;
    const targetSeconds = hasTarget ? estimatedTime * 60 : Infinity;
    const hasReachedTarget = hasTarget && elapsedSeconds >= targetSeconds;
    const progress = hasTarget ? Math.min((elapsedSeconds / targetSeconds) * 100, 100) : 0;

    const intervalRef = useRef<number | null>(null);
    const lastMinuteRef = useRef(0);
    const baseElapsedRef = useRef(0);
    const startTimestampRef = useRef<number | null>(null);

    useEffect(() => {
        const savedProgress = studyTimerService.getProgress(sessionKey);
        const savedSeconds = savedProgress?.elapsedSeconds
            ? Math.floor(savedProgress.elapsedSeconds)
            : 0;

        setElapsedSeconds(savedSeconds);
        baseElapsedRef.current = savedSeconds;
        lastMinuteRef.current = Math.floor(savedSeconds / 60);
        setIsRunning(false);
        setIsInitialized(true);
    }, [sessionKey]);

    const computeElapsed = useCallback(() => {
        if (!isRunning || startTimestampRef.current === null) {
            return baseElapsedRef.current;
        }
        const runningSeconds = (Date.now() - startTimestampRef.current) / 1000;
        return baseElapsedRef.current + runningSeconds;
    }, [isRunning]);

    const applyElapsed = useCallback((rawElapsed: number) => {
        const newValue = Math.floor(rawElapsed);

        setElapsedSeconds(prevDisplayed => {
            if (newValue === prevDisplayed) return prevDisplayed;

            const newMinute = Math.floor(newValue / 60);
            if (newMinute > lastMinuteRef.current) {
                const minutesPassed = newMinute - lastMinuteRef.current;
                lastMinuteRef.current = newMinute;
                onMinuteTick?.(minutesPassed);
            }

            if (newValue % 10 === 0) {
                studyTimerService.saveProgress(sessionKey, newValue);
            }

            onTimeUpdate?.(newValue);
            return newValue;
        });
    }, [sessionKey, onTimeUpdate, onMinuteTick]);

    const tick = useCallback(() => {
        if (!isRunning) return;
        applyElapsed(computeElapsed());
    }, [isRunning, computeElapsed, applyElapsed]);

    useEffect(() => {
        if (!isInitialized) return;

        if (isRunning) {
            intervalRef.current = window.setInterval(tick, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, isInitialized, tick]);

    useEffect(() => {
        const handleVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible') {
                tick();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityOrFocus);
        window.addEventListener('focus', handleVisibilityOrFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
            window.removeEventListener('focus', handleVisibilityOrFocus);
        };
    }, [tick]);

    const start = useCallback(() => {
        if (isInitialized) {
            startTimestampRef.current = Date.now();
            setIsRunning(true);
        }
    }, [isInitialized]);

    const pause = useCallback((): number => {
        const finalElapsed = computeElapsed();
        baseElapsedRef.current = finalElapsed;
        startTimestampRef.current = null;
        setIsRunning(false);
        applyElapsed(finalElapsed);
        studyTimerService.saveProgress(sessionKey, Math.floor(finalElapsed));
        return Math.floor(finalElapsed);
    }, [computeElapsed, applyElapsed, sessionKey]);

    const finishBlock = useCallback((): number => {
        const finalElapsed = pause();
        studyTimerService.clearProgress(sessionKey);
        return finalElapsed;
    }, [pause, sessionKey]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedSeconds(0);
        baseElapsedRef.current = 0;
        startTimestampRef.current = null;
        lastMinuteRef.current = 0;
        studyTimerService.clearProgress(sessionKey);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [sessionKey]);

    const formatTime = (totalSeconds: number): string => {
        const absSeconds = Math.floor(Math.abs(totalSeconds));
        const minutes = Math.floor(absSeconds / 60);
        const seconds = absSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatEstimated = (totalSeconds: number): string => {
        if (!hasTarget) return 'Livre';
        const minutes = Math.floor(totalSeconds / 60);
        return `${minutes}min`;
    };

    return {
        isRunning,
        elapsedSeconds,
        hasReachedTarget,
        hasTarget,
        progress,
        estimatedSeconds: targetSeconds,
        start,
        pause,
        finishBlock,
        reset,
        formattedTime: formatTime(elapsedSeconds),
        formattedEstimated: formatEstimated(targetSeconds)
    };
}