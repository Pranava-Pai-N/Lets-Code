import axios from 'axios';
import dotenv from "dotenv";
import { fileURLToPath } from "url"
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });


export const fetchLeetCodeData = async (username) => {
  const graphqlUrl = process.env.GRAPHQL_URL;
  
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            ranking
            userAvatar
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { username: username }
  };

  try {
    if(!graphqlUrl)
      return;

    const response = await axios.post(graphqlUrl, query, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });
    
    const data = response.data.data.matchedUser;
    
    if (!data) return null;


    const stats = {
      ranking: data.profile.ranking,
      avatar: data.profile.userAvatar,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0
    };

    data.submitStats.acSubmissionNum.forEach(item => {
      if (item.difficulty === "All") stats.totalSolved = item.count;
      if (item.difficulty === "Easy") stats.easySolved = item.count;
      if (item.difficulty === "Medium") stats.mediumSolved = item.count;
      if (item.difficulty === "Hard") stats.hardSolved = item.count;
    });

    return stats;

  } catch (error) {
    console.error("LeetCode Fetch Error:", error);
    return null;
  }
};


