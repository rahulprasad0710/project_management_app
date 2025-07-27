import AuthLayout from "./AuthPageLayout";
import EmailVerifyForm from "@components/auth/EmailVerifyForm";
import PageMeta from "../../components/common/PageMeta";

export default function EmailVerify() {
    return (
        <>
            <PageMeta title='PMA | Signup' description='user login page' />
            <AuthLayout>
                <EmailVerifyForm />
            </AuthLayout>
        </>
    );
}
