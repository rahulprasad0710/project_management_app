import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
    return (
        <>
            <PageMeta title='PMA | Signup' description='user login page' />
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </>
    );
}
