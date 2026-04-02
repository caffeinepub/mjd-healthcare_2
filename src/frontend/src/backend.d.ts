import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactForm {
    name: string;
    email: string;
    company: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    listInquiries(): Promise<Array<ContactForm>>;
    submitContactForm(name: string, email: string, company: string, message: string): Promise<void>;
}
