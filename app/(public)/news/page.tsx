import React from 'react';
import HeroSection from './_components/HeroSection';
import NewsGrid from './_components/NewsGrid';
import { newsItems } from './_data/newsItems';

const NewsPage = () => {
  return (
    <>
      <HeroSection />
      <NewsGrid items={newsItems} />
    </>
  );
};

export default NewsPage;