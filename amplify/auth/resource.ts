import { defineAuth } from '@aws-amplify/backend';

/**
 * Define authentication resource. 
 * Even though we use NextAuth for Google Docs access, 
 * this creates the Cognito User Pool for the Amplify backend app.
 */
export const auth = defineAuth({
    loginWith: {
        email: true,
    },
});
