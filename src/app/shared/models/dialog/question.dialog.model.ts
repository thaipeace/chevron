export interface IQuestionDialogModel {
    title?: string;
    question?: string;
    type?: string;
    onYes?: () => void;
    onNo?: () => void;
}
