export type NoteProps = {
    title: string;
    content: string;
    id: number;
    color: string;
    localStorageName: string;
    position: Position,
    unsaved?: boolean
};

export type Position = {
    x: number,
    y: number
}