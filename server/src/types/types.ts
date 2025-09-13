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

export interface IUserInfo {
    id: number;
    email: string;
    type: string;
    internalCompanies: TInternalCompany[];
    role: IRoleInfo;
}

export interface TInternalCompany {
    internal_company_id: number;
    name: string;
    slug: string;
    logoUrl: string;
    isActive: boolean;
    features: IFeatureInfo[];
}

export interface IFeatureInfo {
    features_id: number;
    features_name: string;
    features_slug: string;
    features_profilePicture: string | null;
    features_user_id: number;
    features_sprint_id: number | null;
    features_sprint_name: string | null;
}

export interface IRoleInfo {
    id: number;
    isActive: boolean;
    name: string;
    permissions: string[];
}
