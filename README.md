Autocomplete API Scraper
Extract all possible names from an undocumented autocomplete API using JavaScript and Axios.

Overview
This project extracts all possible names from the autocomplete API available at:
http://35.200.185.69:8000/v1/autocomplete?query=<string>

Since the API has no documentation, we systematically explore its behavior, handle constraints like rate limiting (HTTP 429), and efficiently extract results using a queue-based recursive search.

 Features
 Dynamic query expansion → Starts with "a-z", expands based on results.
 Rate limit handling → Implements exponential backoff when API returns 429.
 Recursive extraction → Extracts deeper names where needed.
 Efficient API usage → Avoids unnecessary queries.
 Fully automated → Extracts, logs, and saves results.

 Project Structure
perl
Copy
Edit
├── index.js            # Main script to extract names from API
├── package.json        # Node.js project dependencies
├── package-lock.json   # Dependency lock file
├── README.md           # Project documentation
└── .gitignore          # Ignore unnecessary files (node_modules, logs)
 Installation
1️ Prerequisites
Node.js (Download from here)

Git (Optional, for cloning the repository)

2️ Clone the Repository
sh
Copy
Edit
git clone https://github.com/your-username/autocomplete-api-scraper.git
cd autocomplete-api-scraper
3️ Install Dependencies
sh
Copy
Edit
npm install
This installs required packages like axios for API calls.

 Usage
Run the script to start extracting names:
sh
Copy
Edit
node index.js
The script will:

Start querying with "a-z".

Expand queries only where necessary.

Handle rate limits using exponential backoff.

Save extracted names in names.txt.

 Approach
1️ API Exploration
Since there’s no documentation, we first tested:
 What query patterns return results? (a, ab, abc, xyz)
 How many results are returned per query? (Max 10 results)
 What happens when rate limits are hit? (HTTP 429 errors)

2️ Query Expansion Strategy
Start with "a-z".

If a query returns 10 names, expand it (aa, ab, ac, ...).

Stop expanding when results drop below 10 (no more names exist).

3️ Handling API Rate Limits
The API blocks excessive requests (HTTP 429).

Implemented exponential backoff:

1st retry → Wait 2s

2nd retry → Wait 4s

3rd retry → Wait 8s

Max retries: 5

 Example Output
rust
Copy
Edit
Extracted 10 names for prefix 'a'
Extracted 10 names for prefix 'b'
Extracted 10 names for prefix 'c'
...
Error fetching 'cw': Request failed with status 429
Rate limit hit for query 'cx'. Retrying...
Waiting for 4 seconds before retrying...
Extracted 10 names for prefix 'cz'
Total names extracted: 945
All results are saved in names.txt.

 Results
Total API Requests: Varies based on expansion strategy

Total Names Extracted: Depends on the dataset

Time Taken: Optimized using delay management

 Known Issues & Fixes
Issue	Solution
API returns 429 Too Many Requests	Implemented exponential backoff with retries
Some queries return duplicate names	Used Set() to store unique names
API limits results to 10 per query	Expanded only when necessary
 Contribution
Want to improve this scraper? Feel free to:

Fork the repo

Make changes

Submit a pull request! 

 License
This project is MIT Licensed – free to use, modify, and distribute.

 Submission
Once you get the extracted results, submit your solution here.

 Final Thoughts
This project systematically extracts names from an undocumented API while handling rate limits and optimizing API calls. If you have any suggestions or improvements, feel free to contribute! 

 Next Steps
Run node index.js and check names.txt for results!

Improve efficiency with parallel requests.

Deploy on cloud for automation.