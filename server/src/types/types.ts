export interface TEmail {
    to: string[];
    subject: string;
    text: string;
    html?: string;
}

export type TNotification = {
    type: string;
    message: string;
    payload: string;
    link?: string;
    html_template?: string;
};
