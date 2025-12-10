import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth';
import { data } from './data';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
    auth,
    data,
});
