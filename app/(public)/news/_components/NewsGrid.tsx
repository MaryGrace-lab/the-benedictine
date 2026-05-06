"use client";

import React from 'react';
import NewsCard from './NewsCard';
import { NewsItem } from '../_data/newsItems';

interface NewsGridProps {
  items: NewsItem[];
}

const NewsGrid = ({ items }: NewsGridProps) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {items.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;