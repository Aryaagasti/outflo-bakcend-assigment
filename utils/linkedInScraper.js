const puppeteer = require('puppeteer');
const Profile = require('../models/Profile');
require('dotenv').config();

exports.scrapeLinkedInProfiles = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined // For Render or custom environments
  });
  const page = await browser.newPage();

  try {
    // Set a user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to LinkedIn login page
    console.log('Navigating to LinkedIn login page...');
    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'networkidle2',
      timeout: 60000 // Increase timeout
    });

    // Add login logic
    const username = process.env.LINKEDIN_EMAIL;
    const password = process.env.LINKEDIN_PASSWORD;

    if (!username || !password) {
      throw new Error('LinkedIn credentials (LINKEDIN_EMAIL and LINKEDIN_PASSWORD) must be set in .env');
    }

    // Updated selectors for login form (as of June 2025)
    console.log('Entering credentials...');
    await page.waitForSelector('input[name="session_key"]', { timeout: 10000 }); // Updated selector for username
    await page.type('input[name="session_key"]', username, { delay: 100 });

    await page.waitForSelector('input[name="session_password"]', { timeout: 10000 }); // Updated selector for password
    await page.type('input[name="session_password"]', password, { delay: 100 });

    // Submit the login form
    await page.click('button[type="submit"]', { delay: 100 }); // Updated selector for login button
    console.log('Submitting login form...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

    // Check if login was successful
    const isLoggedIn = await page.$('a[data-tracking-control-name="nav-header-profile"]'); // Updated selector for profile icon
    if (!isLoggedIn) {
      const errorText = await page.evaluate(() => document.body.innerText);
      console.error('Login page content:', errorText);
      throw new Error('LinkedIn login failed. Check credentials or handle CAPTCHA/2FA manually.');
    }
    console.log('Logged in successfully!');

    // Navigate to LinkedIn search results
    console.log(`Navigating to search results for query: ${searchQuery}...`);
    await page.goto(
      `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`,
      { waitUntil: 'networkidle2', timeout: 60000 }
    );

    // Wait for search results to load
    await page.waitForSelector('ul.reusable-search__entity-result-list', { timeout: 10000 });
    console.log('Search results loaded.');

    // Scroll to load more profiles
    await autoScroll(page);
    console.log('Finished scrolling to load more profiles.');

    // Scrape profile data with updated selectors
    const profiles = await page.evaluate(() => {
      const profileElements = document.querySelectorAll('li.reusable-search__result-container'); // Updated selector for profile cards
      const scrapedProfiles = [];

      for (let i = 0; i < Math.min(10, profileElements.length); i++) { // Limit to 10 profiles to avoid rate limits
        const element = profileElements[i];

        const name = element.querySelector('span.entity-result__title-text a span[aria-hidden="true"]')?.innerText.trim() || 'N/A';
        const jobTitle = element.querySelector('div.entity-result__primary-subtitle')?.innerText.trim() || 'N/A';
        const companyMatch = jobTitle.match(/at (.*)$/);
        const company = companyMatch ? companyMatch[1] : 'N/A';
        const location = element.querySelector('div.entity-result__secondary-subtitle')?.innerText.trim() || 'N/A';
        const summary = element.querySelector('p.entity-result__summary')?.innerText.trim() || 'N/A';

        if (name !== 'N/A') { // Only include profiles with a valid name
          scrapedProfiles.push({
            name,
            job_title: jobTitle,
            company,
            location,
            summary,
          });
        }
      }

      return scrapedProfiles;
    });

    console.log(`Scraped ${profiles.length} profiles:`, profiles);

    // Save profiles to MongoDB
    if (profiles.length > 0) {
      for (const profile of profiles) {
        await Profile.create(profile);
      }
      console.log('Profiles saved to MongoDB.');
    } else {
      console.warn('No profiles were scraped.');
    }

    return profiles;
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200); // Increased delay to avoid rate limiting
    });
  });
}