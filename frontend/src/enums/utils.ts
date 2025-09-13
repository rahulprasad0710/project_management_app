export const ActivityAction = {
    CREATED_TICKET: "CREATED_TICKET",
    ASSIGNED_TICKET: "ASSIGNED_TICKET",
    MOVED_TICKET: "MOVED_TICKET",
    UPDATED_TICKET: "UPDATED_TICKET",
    COMMENTED_TICKET: "COMMENTED_TICKET",
    DELETED_COMMENT: "DELETED_COMMENT",
    EDITED_COMMENT: "EDITED_COMMENT",
} as const;

export type ActivityAction =
    (typeof ActivityAction)[keyof typeof ActivityAction];

export enum CredentialType {
    ADMIN = "ADMIN",
    Google = "GOOGLE",
    CUSTOMER_CREDENTIAL = "CUSTOMER_CREDENTIAL",
}
