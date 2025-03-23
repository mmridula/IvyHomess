const axios = require('axios');

// Utility function for delay
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to fetch results with retry logic
async function fetchResults(baseUrl, query, retryCounts, baseDelayMs) {
    let attempt = 0;

    do {
        try {
            const response = await axios.get(`${baseUrl}?query=${query}`);

            if (response.status === 200 && response.data.results) {
                return response.data.results;
            }

            console.error(`Error: Received status ${response.status} for query "${query}"`);
            return [];
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`Rate limit hit for query "${query}". Retrying...`);

                retryCounts[query] = (retryCounts[query] || 0) + 1;
                const retryAfter = error.response.headers['retry-after'];
                const waitTime = retryAfter
                    ? parseInt(retryAfter, 10) * 1000
                    : baseDelayMs * Math.pow(2, retryCounts[query]);

                console.log(`Waiting for ${waitTime / 1000} seconds before retrying...`);
                await delay(waitTime);
            } else {
                console.error(`Error with query "${query}":`, error.message);
                return [];
            }
        }

        attempt++;
    } while (attempt < 5); // Limit retries to prevent infinite looping

    return [];
}


// Function to extract all names
async function extractAllNames(baseUrl, alphabet, baseDelayMs) {
    const extractedNames = new Set();
    const queue = [...alphabet];
    let searchCount = 0;
    const retryCounts = {};

    for (const query of queue) {
        searchCount++;

        const results = await fetchResults(baseUrl, query, retryCounts, baseDelayMs);

        for (const name of results) {
            if (!extractedNames.has(name)) {
                extractedNames.add(name);
                queue.push(name);
            }
        }

        await delay(baseDelayMs);
    }

    console.log(`Total searches made: ${searchCount}`);
    return Array.from(extractedNames);
}


// Main execution function
(async () => {
    const baseUrl = "http://35.200.185.69:8000/v1/autocomplete";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const baseDelayMs = 500;

    console.log("Extracting all names from the autocomplete API...");
    const allNames = await extractAllNames(baseUrl, alphabet, baseDelayMs);

    console.log(`Total names extracted: ${allNames.length}`);
    console.log("Sample names:", allNames.slice(0, 10));
})();
