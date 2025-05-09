import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

// Creating an activity here. The result of the activity will be stored in variable greet.
const { greet } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
    return await greet(name);
}