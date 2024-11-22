import { refreshData } from "./refresh";

export async function withRetry(
  operation: () => Promise<any>,
  retries: number,
  delay: number,
  refreshLimit: number = 3 // Default refresh limit if retries exceed
): Promise<any> {
  let attempt = 0;
  let refreshAttempts = 0;

  while (attempt <= retries) {
    try {
      // Attempt the operation
      console.log(`Attempt ${attempt + 1} of ${retries + 1}`);
      return await operation();
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed. ${retries - attempt} retries left.`);

      if (attempt <= retries) {
        // Retry with delay
        console.log('Retrying operation...');
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // If retry count exceeded and refresh limit is available, refresh request
      if (attempt > retries && refreshAttempts < refreshLimit) {
        console.log("Maximum retry limit reached. Refreshing...");
        refreshAttempts++;
        await refreshData(); // Use the local refreshData function
      }
    }
  }

  // Throw error after retries are exhausted
  throw new Error('Max retries exceeded. Operation failed.');
}
