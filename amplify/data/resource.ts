import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
 * This is a placeholder for the data schema.
 * We are currently using Google Drive as our "database".
 */
const schema = a.schema({
    Todo: a.model({
        content: a.string(),
    }).authorization(allow => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'iam',
    },
});
