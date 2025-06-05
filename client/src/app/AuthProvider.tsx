import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import dotenv from "dotenv";

dotenv.config();

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_POOL_ID || "",
    },
  },
});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  console.log({
    userPoolId: process.env.NEXT_COGNITO_POOL_ID || "",
    userPoolClientId: process.env.NEXT_COGNITO_CLIENT_POOL_ID || "",
  });
  const formFields = {
    signUp: {
      username: {
        label: "username",
        placeholder: "Enter your username",
        order: 1,
        inputProps: {
          type: "text",
          required: true,
        },
      },
      email: {
        label: "Email",
        placeholder: "Enter your email:",
        inputProps: {
          type: "text",
          required: true,
        },
        order: 2,
      },
      password: {
        label: "Password",
        placeholder: "Enter your Password:",

        inputProps: {
          type: "password",
          required: true,
        },
        order: 3,
      },
      confirm_password: {
        label: "Confirm Password",
        placeholder: "Confirm your Password.",

        inputProps: {
          type: "password",
          required: true,
        },
        order: 3,
      },
    },
  };

  const services = {
    async confirmSignUp(data: any) {
      console.log({
        ...data,
      });
    },
  };

  const { children } = props;
  return (
    <div>
      <Authenticator
        services={services}
        variation="default"
        formFields={formFields}
      >
        {({ signOut, user }) => (
          <main>
            <div>
              {/* {JSON.stringify(user)} */}
              {user ? <div>{children}</div> : <div>Please Sign-in</div>}
            </div>
          </main>
        )}
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
