import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentItem } from '../ContentItem/ContentItem';
import type { Content, ImportanceLevel, ChecklistItem, QuestionList } from '../../types/topic.types';

interface ActiveBlockInfo {
    id: string;
    minutes: number;
    originalMinutes?: number;
}

interface SortableContentItemProps {
    content: Content;
    topicId: string;
    topicName?: string;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (id: string, title: string, importance: ImportanceLevel) => void;
    onCancel: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onCopyToTopic?: (content: Content) => void;
    activeBlock?: ActiveBlockInfo | null;
    onBlockMinuteTick?: (minutes: number) => void;
    onBlockCompleteBlock?: (blockId: string) => void;
    onUpdateChecklist: (contentId: string, items: ChecklistItem[]) => void;
    onUpdateNotes: (contentId: string, notes: string) => void;
    onUpdateQuestions?: (contentId: string, lists: QuestionList[]) => void;
    onCompleteReview?: (contentId: string, durationMinutes: number) => void;
    showDragHandle?: boolean;
}

export function SortableContentItem(props: SortableContentItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.content.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 0,
    };

    const handleToggleComplete = () => {
        props.onToggleComplete();
    };

    const handleDelete = () => {
        props.onDelete();
    };

    return (
        <div ref={setNodeRef} style={style}>
            <ContentItem
                content={props.content}
                topicId={props.topicId}
                topicName={props.topicName}
                index={props.index}
                isEditing={props.isEditing}
                onEdit={props.onEdit}
                onSave={props.onSave}
                onCancel={props.onCancel}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                onCopyToTopic={props.onCopyToTopic}
                activeBlock={props.activeBlock}
                onBlockMinuteTick={props.onBlockMinuteTick}
                onBlockCompleteBlock={props.onBlockCompleteBlock}
                onUpdateChecklist={props.onUpdateChecklist}
                onUpdateNotes={props.onUpdateNotes}
                onUpdateQuestions={props.onUpdateQuestions}
                onCompleteReview={props.onCompleteReview}
                dragHandleProps={props.showDragHandle ? { ...attributes, ...listeners } : undefined}
            />
        </div>
    );
}