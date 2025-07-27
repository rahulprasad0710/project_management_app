import AuthLayout from "./AuthPageLayout";
import PageMeta from "@/components/common/PageMeta";
import SignInForm from "@components/auth/SignInForm";

export default function SignIn() {
    return (
        <>
            <PageMeta title='PMA | Signup' description='user login page' />
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </>
    );
}
