import { Timer } from '../timer/Timer';
import { StudyTools } from '../study-tools/StudyTools';
import type { ChecklistItem, QuestionList, Note } from '../../types/study.types';
import styles from './StudyWidget.module.css';

interface StudyWidgetProps {
    sessionKey: string;
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime: number;
    onTimeUpdate?: (elapsedSeconds: number) => void;
    onMinuteTick?: (minutes: number) => void;
    onFinishContent?: (contentId: string, elapsedSecondsAtThatMoment: number) => void;
    onCompleteBlock?: (sessionKey: string, totalSeconds: number) => void;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
    notes?: Note[];
    onUpdateNotes?: (notes: Note[]) => void;
    className?: string;
}

export function StudyWidget({
    sessionKey,
    topicId,
    contentId,
    topicName,
    contentTitle,
    estimatedTime,
    onTimeUpdate,
    onMinuteTick,
    onFinishContent,
    onCompleteBlock,
    checklist,
    onUpdateChecklist,
    questionLists,
    onUpdateQuestions,
    notes,
    onUpdateNotes,
    className = ''
}: StudyWidgetProps) {
    return (
        <div className={`${styles.studyWidget} ${className}`}>
            <div className={styles.timerSection}>
                <Timer
                    sessionKey={sessionKey}
                    topicId={topicId}
                    contentId={contentId}
                    topicName={topicName}
                    contentTitle={contentTitle}
                    estimatedTime={estimatedTime}
                    onTimeUpdate={onTimeUpdate}
                    onMinuteTick={onMinuteTick}
                    onFinishContent={onFinishContent}
                    onCompleteBlock={onCompleteBlock}
                />
            </div>

            <div className={styles.toolsSection}>
                <StudyTools
                    topicId={topicId}
                    contentId={contentId}
                    checklist={checklist}
                    onUpdateChecklist={onUpdateChecklist}
                    questionLists={questionLists}
                    onUpdateQuestions={onUpdateQuestions}
                    notes={notes}
                    onUpdateNotes={onUpdateNotes}
                />
            </div>
        </div>
    );
}