/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thebenedictineacademyportal.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin-portal/*',
    '/teacher-portal/*',
    '/student-portal/*',
    '/api/*',
  ],
};