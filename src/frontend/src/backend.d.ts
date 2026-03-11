import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    sender: string;
}
export interface backendInterface {
    addUserMessage(content: string): Promise<Message>;
    getAssistantName(): Promise<string>;
    getMessages(): Promise<Array<Message>>;
    updateAssistantName(newName: string): Promise<void>;
}
