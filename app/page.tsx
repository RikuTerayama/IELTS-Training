'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { buildContactGoogleFormUrl, CONTACT_EMAIL, CONTACT_MAILTO, BLOG_OFFICIAL_URL, BLOG_NOTE_URL } from '@/lib/constants/contact';
import { BrandLink, BrandMark } from '@/components/branding/Brand';
import { PublicHeader } from '@/components/layout/PublicHeader';

// --- 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髣包ｽｵ陷会ｽｱ郢晢ｽｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ驕ｶ謫ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ郢晢ｽｻ繝ｻ・ｪ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯ｷ・ｿ陷ｴ繝ｻ・ｽ・ｽ繝ｻ・ｨ鬮ｮ蜈ｷ・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢繝ｻ・ｧ髫ｰ繝ｻ竏槭・・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｮ隲幢ｽｶ繝ｻ・ｽ繝ｻ・｣驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髫ｰ・ｫ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ---
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // easeOutExpo
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯ｷ・ｿ陷ｴ繝ｻ・ｽ・ｽ繝ｻ・ｨ鬮ｮ蜈ｷ・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢繝ｻ・ｧ髫ｰ繝ｻ竏槭・・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｮ隲幢ｽｶ繝ｻ・ｽ繝ｻ・｣驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髫ｰ・ｫ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ---
const Icons = {
  Check: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Chart: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Brain: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Pencil: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Book: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  ArrowRight: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Alert: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Target: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Layers: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Mic: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
};

const PRIVACY_SECTIONS = [
  {
    title: '1. Information we collect',
    paragraphs: [
      'Meridian stores the minimum account and learning data needed to run the service. This may include your email address, product usage history, submitted answers, and billing-related identifiers.',
    ],
    bullets: [
      'Account details needed for sign-in and support',
      'Learning progress such as attempts, feedback, and review history',
      'Operational logs needed to keep the service stable and secure',
      'Billing identifiers from payment providers when you upgrade',
    ],
  },
  {
    title: '2. How we use the information',
    paragraphs: [
      'We use this information to provide learning features, improve product quality, prevent abuse, and support billing or account recovery when needed.',
    ],
    bullets: [
      'Deliver practice, feedback, and progress tracking',
      'Improve reliability and diagnose service issues',
      'Operate billing, access control, and upgrade flows',
      'Respond to support or contact requests',
    ],
  },
  {
    title: '3. Storage and third parties',
    paragraphs: [
      'Data is processed using infrastructure such as Supabase for application data and Stripe for billing. AI-related requests may be sent to model providers to generate feedback or evaluation results.',
      'We only share the data required to perform those functions and do not sell personal information.',
    ],
  },
  {
    title: '4. Security',
    paragraphs: [
      'We take reasonable technical and operational measures to protect account and learning data. However, no internet service can guarantee perfect security.',
    ],
  },
  {
    title: '5. Your choices',
    paragraphs: [
      'You can contact us if you need help with account access, billing questions, or deletion requests. We may need to verify ownership before making account-level changes.',
    ],
  },
  {
    title: '6. Updates',
    paragraphs: [
      'We may update this Privacy Policy as the product evolves. Material changes will be reflected on this page with an updated revision date.',
    ],
  },
] as const;

const TERMS_SECTIONS = [
  {
    title: '1. Service overview',
    paragraphs: [
      'Meridian provides IELTS-focused learning tools, AI-assisted feedback, progress tracking, and related educational content. Feature availability may change over time.',
    ],
  },
  {
    title: '2. Accounts and access',
    paragraphs: [
      'You are responsible for maintaining the security of your account and for activity performed through it. Do not share credentials or attempt to access another user account.',
    ],
    bullets: [
      'Use accurate account information',
      'Keep your sign-in credentials private',
      'Do not misuse trial, quota, or billing systems',
    ],
  },
  {
    title: '3. AI output and learning guidance',
    paragraphs: [
      'AI-generated scores, rewrites, and recommendations are learning aids. They are not official IELTS scores and should be treated as guidance rather than guarantees.',
    ],
  },
  {
    title: '4. Acceptable use',
    paragraphs: [
      'Do not use the service to abuse infrastructure, scrape content, interfere with other users, or submit unlawful or harmful material.',
    ],
  },
  {
    title: '5. Billing and upgrades',
    paragraphs: [
      'Paid features may be offered through recurring or one-time billing. Pricing, limits, and billing terms are shown at checkout or on the Pricing page.',
    ],
  },
  {
    title: '6. Availability and changes',
    paragraphs: [
      'We may update, suspend, or discontinue features when needed for security, maintenance, or product changes. We aim to do this responsibly but cannot guarantee uninterrupted availability.',
    ],
  },
  {
    title: '7. Contact',
    paragraphs: [
      'If you have questions about these terms, contact us through the contact section on this page or by email.',
    ],
  },
] as const;

export default function LandingPage() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // --- 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｫ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｶ鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ ---
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary text-text font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｴ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｮ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｷ鬮ｫ・ｰ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｬ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/60 rounded-[100%] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/40 rounded-[100%] blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯ｷ・ｿ陷ｴ繝ｻ・ｽ・ｽ繝ｻ・ｸ髯ｷ・ｿ繝ｻ・ｯ繝ｻ縺､ﾂ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・･鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｰ郢晢ｽｻ繝ｻ・ｨ鬯ｯ・ｲ隰・∞・ｽ・ｽ繝ｻ・ｴ郢晢ｽｻ邵ｺ・､・つ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ */}
      <PublicHeader variant="floating" contactHref="/#contact" />

      <main className="relative z-10 pt-32 pb-0">
        
        {/* 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髫ｲ・ｰ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｸ鬩怜遜・ｽ・ｫ驛｢譎｢・ｽ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ */}
        <div className="container mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* 鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｯ・ｷ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ: 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ鬮ｯ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・､驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left pt-8">
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  New AI Engine V2.0
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="flex justify-center lg:justify-start">
                  <BrandMark size={56} textClassName="text-2xl text-primary" priority />
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                {/* 鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・｣鬮ｫ・ｲ陟阪・・ｽ・ｴ郢晢ｽｻ繝ｻ・ｧ鬯ｮ・ｯ繝ｻ・ｷ髯樊ｻゑｽｽ・ｲ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｱ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髫ｲ・ｰ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｸ鬩怜遜・ｽ・ｫ驛｢譎｢・ｽ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｮ遏ｩ・ｰ驢崎｢也ｹ晢ｽｻ繝ｻ・ｱ髯橸ｽ｢繝ｻ・ｹ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・ｮ髣包ｽｵ隴擾ｽｴ郢晢ｽｻ鬩包ｽｶ闕ｵ證ｦ・ｽ・ｧ繝ｻ・ｭ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻtext-display 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｮ繝ｻ・ｯ髯ｷ闌ｨ・ｽ・ｷ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｯ髯区ｺ倥・繝ｻ・ｽ繝ｻ・ｿ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬮ｫ・ｴ遶擾ｽｬ郢晢ｽｻ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻtext-5xl/lg:text-7xl 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｮ繝ｻ・ｯ髫ｲ蟷｢・ｽ・ｶ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｣鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｶ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｫ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｮ・ｫ繝ｻ・ｰ鬮ｮ蜈ｷ・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｶ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ*/}
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-text leading-[1.1]">
                  Score Higher with <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Intelligent</span> Feedback.
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <p className="text-body-lg text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  AI and learning data help turn IELTS score plateaus into a concrete next step.
                  Latest feedback and guided practice loops help you keep momentum.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 text-sm font-semibold text-text">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    鬯ｮ・ｯ繝ｻ・ｷ髯槭ｅ繝ｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｸ繝ｻ・ｺ髯晢ｽｶ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬮ｫ・ｴ繝ｻ・ｴ郢晢ｽｻ繝ｻ・ｵ
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    鬯ｮ・ｯ雋頑瑳・ｱ螢ｹ繝ｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｱ鬯ｮ・ｴ鬮ｮ・｣繝ｻ・ｽ繝ｻ・､驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・･鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 rounded-full text-green-600"><Icons.Check className="w-3 h-3" /></div>
                    鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・Δ譎｢・ｽ・ｻ郢晢ｽｻ陷ｿ蜴・ｽｽ・ｺ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </div>
                </div>
                <a
                  href={BLOG_NOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Icons.Book className="w-4 h-4" />
                  Note鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ讖ｸ・ｽ・ｳ髯樊ｻゑｽｽ・ｲ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬮｣蛹・ｽｽ・ｵ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ
                </a>
              </FadeIn>
            </div>

            {/* 鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｯ・ｷ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ: 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻriting, Speaking, Vocab, Pricing, Login鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ*/}
            <FadeIn delay={0.5} className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl shadow-theme-lg ring-1 ring-border p-8">
                <h2 className="text-xl font-bold text-text mb-2">Start here</h2>
                <p className="text-sm text-text-muted mb-6">
                  Choose Reading, Writing, Speaking, Vocab, or Pricing from here.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/reading"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Book className="w-5 h-5 text-primary" />
                      Reading
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/writing"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Pencil className="w-5 h-5 text-primary" />
                      Writing
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/speaking"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Mic className="w-5 h-5 text-primary" />
                      Speaking
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/vocab"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Book className="w-5 h-5 text-primary" />
                      Vocab
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-4 py-3 text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Icons.Target className="w-5 h-5 text-primary" />
                      Pricing
                    </span>
                    <Icons.ArrowRight className="w-4 h-4 text-text-muted" />
                  </Link>
                  <Link
                    href="/login"
                    className="mt-2 w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｲ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｮ・ｯ陋ｹ・ｺ繝ｻ・ｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｡鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｴ鬮ｫ・ｲ陝ｶ・ｷ繝ｻ・ｿ繝ｻ・ｫ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｮ鬮ｫ・ｰ郢晢ｽｻ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ */}
        <section className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｫ・ｲ陝ｶ・ｷ髢ｻ・ｸ繝ｻ縺､ﾂ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｫ鬮ｯ譎｢・ｽ・ｲ郢晢ｽｻ繝ｻ・｡鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ闔ｨ螟ｲ・ｽ・ｽ繝ｻ・ｱ驛｢譎｢・ｽ・ｻ髫ｶ謐ｺ諷｣繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
              </h2>
              <p className="text-text-muted text-lg">
                鬯ｮ・ｯ隶灘･・ｽｽ・ｺ繝ｻ・ｷ郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・･鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮIELTS鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・ｹ晢ｽｻ繝ｻ・ｮ髯懶ｽ｣闔会ｽｰ・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩包ｽｯ繝ｻ・ｶ郢晢ｽｻ繝ｻ・ｲ鬯ｯ・ｨ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｱ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ鬩阪・謌滂ｾつ繝ｻ・ｦ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ鬯ｯ・ｯ繝ｻ・ｨ郢晢ｽｻ繝ｻ・ｾ鬮ｯ讖ｸ・ｽ・｢郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｱ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｲ鬯ｯ・ｯ繝ｻ・ｯ髣費ｽｨ隲幢ｽｶ繝ｻ・ｽ繝ｻ・ｾ髯橸ｽｽ繝ｻ・ｯ繝ｻ縺､ﾂ郢晢ｽｻ繝ｻ・ｲ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｯ蛟ｩ・ｲ・ｻ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.15}>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Alert className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">鬯ｩ蟷｢・ｽ・｢髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ竏ｫ・ｵ・ｶ髫伜､懶ｽｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩搾ｽｵ繝ｻ・ｺ鬯ｩ・｢隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・｣陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｳ鬮ｯ譎｢・｣・ｰ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    鬯ｯ・ｮ繝ｻ・｢郢晢ｽｻ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｱ鬯ｮ・ｫ繝ｻ・ｰ髫ｴ莨夲ｽｽ・ｦ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｡鬯ｮ・ｴ鬮ｮ・｣繝ｻ・ｽ繝ｻ・､驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣豈費ｽｼ螟ｲ・ｽ・ｽ繝ｻ・｣鬩搾ｽｵ繝ｻ・ｲ髯懶ｽ｣繝ｻ・､郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｮ・ｴ陜捺ｺｷ郢ｭ繝ｻ縺､ﾂ郢晢ｽｻ繝ｻ・ｲ鬯ｯ・ｮ繝ｻ・ｮ髫ｲ蟷｢・ｽ・ｶ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬯ｩ諤憺●繝ｻ・ｽ繝ｻ・ｫ鬩包ｽｶ闔ｨ竏壹・郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｵ髫ｰ・ｨ鬲托ｽｴ・つ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｣繝ｻ・ｺ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｮ・ｦ繝ｻ・ｮ髯ｷ・ｻ繝ｻ・ｻ郢晢ｽｻ繝ｻ・ｽ髯晢ｽｶ隰ｨ魑ｴﾂ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ鬩包ｽｶ陷闍難ｽｷ譏ｴ繝ｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・ｦ郢晢ｽｻ繝ｻ・ｪ郢晢ｽｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｰ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｴ謇假ｽｽ・ｹ髯樊ｻゑｽｽ・ｲ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬮｣蛹・ｽｽ・ｵ髫ｴ謫ｾ・ｽ・ｶ髫ｴ繝ｻ・ｽ・｡鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｳ髯槭ｅ繝ｻ繝ｻ・ｽ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｵ鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｼ鬯ｮ・ｯ隲幄肩・ｽ・ｺ陋滂ｽ･郢晢ｽｻ鬩包ｽｯ繝ｻ・ｶ郢晢ｽｻ繝ｻ・ｲ鬯ｮ・ｮ陟托ｽｱ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬯ｩ諤憺●繝ｻ・ｽ繝ｻ・ｫ鬩包ｽｯ繝ｻ・ｶ郢晢ｽｻ繝ｻ・ｲ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">鬯ｮ・ｯ繝ｻ・ｷ髯ｷ・･繝ｻ・ｲ鬨ｾ蛹・ｽｽ・･驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｫ繝ｻ・ｴ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｷ鬯ｮ・ｫ繝ｻ・ｨ郢晢ｽｻ繝ｻ・ｬ郢晢ｽｻ邵ｺ・､・つ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｩ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｯ・ｯ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ鬮ｯ蜈ｷ・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｿ鬮ｫ・ｰ髮具ｽｻ繝ｻ・ｽ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ髣費ｽｨ遶丞｣ｺ蜃ｰ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ驕ｶ謫ｾ・ｽ・ｫ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ蜈ｷ・ｽ・ｹ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ髫ｶ謐ｺ諷｣繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｵ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ鬮｢・ｾ繝ｻ・･郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｯ・ｩ隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｯ鬮ｯ讖ｸ・ｽ・｢郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬩幢ｽ｢繝ｻ・ｧ驛｢譎｢・ｽ・ｻ繝ｻ縺､ﾂ鬩搾ｽｵ繝ｻ・ｲ郢晢ｽｻ繝ｻ・｢nd 5.5 鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｵ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ7.0 鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隶厄ｽｸ繝ｻ・ｽ繝ｻ・｢鬩包ｽｶ闕ｳ讖ｸ・ｽ・､繝ｻ・ｲ郢晢ｽｻ繝ｻ・ｽ髯晢ｽｶ隴取得・ｽ・ｱ郢晢ｽｻ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｫ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｳ髯槭ｅ繝ｻ繝ｻ・ｽ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬯ｩ諤憺●繝ｻ・ｽ繝ｻ・ｫ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-2xl bg-surface-2 border border-border min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">Sustainable study design</h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    Clear next steps make practice easier to continue over time.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Features 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ (Bento Grid) */}
        <section id="features" className="py-24 bg-bg-secondary">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｣繝ｻ・ｺ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ鬩包ｽｶ陷闍難ｽｷ譏ｴ繝ｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ
              </h2>
              <p className="text-text-muted text-lg">
                AI鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬮ｫ・ｴ繝ｻ・ｴ郢晢ｽｻ繝ｻ・ｵ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諛育ｴ皮ｹ晢ｽｻ繝ｻ・ｲ髫ｶ蜴・ｽｽ・ｸ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｰ鬮ｯ讖ｸ・ｽ・ｳ鬮｣魃会ｽｽ・ｨ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｷ鬮ｯ讖ｸ・ｽ・｢郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ髯晢ｽｶ隴擾ｽｴ隨卍鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｩ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｷ鬮ｯ蜈ｷ・ｽ・ｹ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ髯ｷﾂ隴会ｽｦ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ譎｢・ｽ・ｶ髯ｷ・ｷ繝ｻ・ｮ鬮ｯ讖ｸ・ｽ・ｺ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｣繝ｻ・ｹ驕ｯ・ｶ繝ｻ・ｲ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｫ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｯ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮIELTS鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・Δ譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｩ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｨ鬯ｩ蟷｢・ｽ・｢髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ繝ｻ謳ｨ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｰ
              </p>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">AI instant feedback</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Get concrete, immediate feedback on IELTS answers so you know what to improve next.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Book className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">Smart vocabulary review</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    SRS helps schedule the right vocabulary and expression review at the right time.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Chart className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">鬯ｯ・ｯ繝ｻ・ｨ郢晢ｽｻ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｲ鬯ｮ・ｫ繝ｻ・ｰ髣皮甥髮繝ｻ・ｹ繝ｻ・ｲ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｮ繝ｻ・ｫ髫ｴ莨夲ｽｽ・ｮ鬮ｷ・ｫ繝ｻ・ｩ鬮ｯ諛茨ｽｻ繧托ｽｽ・ｽ繝ｻ・ｧ</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    鬯ｮ・ｫ繝ｻ・ｴ鬯ｲ繝ｻ・ｼ螟ｲ・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・･鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・ｹ晢ｽｻ繝ｻ・ｮ髯樊ｻゑｽｽ・ｲ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｨ鬮ｯ蛹ｺ・ｻ繧托ｽｽ・ｽ繝ｻ・ｬ鬯ｲ繝ｻ遘√・・ｽ繝ｻ・ｸ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｮ・ｫ繝ｻ・ｰ髫ｰ逍ｲ・ｺ蛟･繝ｻ鬮ｫ・ｴ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｡鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬯ｮ・ｮ陋ｹ・ｺ繝ｻ・ｧ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ髯懃軸諢輔・・ｫ繝ｻ・｢繝ｻ縺､ﾂ鬮ｯ諛茨ｽｻ繧托ｽｽ・ｽ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ闔ｨ螟ｲ・ｽ・ｽ繝ｻ・ｱ郢晢ｽｻ邵ｺ・､・つ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｵ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｬ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ髴托ｽ｢隴会ｽｦ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・ｦ郢晢ｽｻ繝ｻ・ｪ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ讖ｸ・ｽ・ｳ髯樊ｻゑｽｽ・ｲ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮｣蛹・ｽｽ・ｳ髯晢ｽｯ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｸ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮｣蛹・ｽｽ・ｵ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ鬮｢・ｧ繝ｻ・ｲ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩包ｽｶ闔ｨ竏ｬ・ｱ・ｪ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ闔ｨ螟ｲ・ｽ・ｽ繝ｻ・ｱ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-surface rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all min-h-[260px] flex flex-col">
                  <div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                    <Icons.Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-3 font-bold text-text mb-3">鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｬ鬯ｩ蟷｢・ｽ・｢髫ｴ荳ｻ繝ｻ陷・ｽｽ郢晢ｽｻ陷ｿ髢繝ｻ髯晢｣ｰ髴域鱒繝ｻ郢晢ｽｻ繝ｻ・･鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｪ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・･鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｩ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｰ</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    鬯ｮ・ｴ隰・∞・ｽ・ｽ繝ｻ・ｴ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ隲幢ｽｶ繝ｻ・ｽ繝ｻ・ｨ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｬ鬯ｩ蟷｢・ｽ・｢髫ｴ荳ｻ繝ｻ陷・ｽｽ郢晢ｽｻ陷ｿ髢譌ｭ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｷ鬮ｯ蜈ｷ・ｽ・ｹ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ髯ｷﾂ隴会ｽｦ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ譎｢・ｽ・ｶ髯ｷ・ｷ繝ｻ・ｮ繝ｻ縺､ﾂ郢晢ｽｻ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｫ鬮ｫ・ｨ陷證ｦ・ｽ・｢郢晢ｽｻ・つ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ鬩包ｽｶ闔ｨ竏壹・郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ・つ髫ｴ莨夲ｽｽ・ｦ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｶ鬮ｯ讖ｸ・ｽ・｢郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ譎｢・ｽ・ｲ郢晢ｽｻ繝ｻ・ｨ驛｢譎｢・ｽ・ｻ髫ｶ蜻ｵ・ｶ・｣繝ｻ・ｽ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ鬮ｯ・ｷ繝ｻ・ｿ郢晢ｽｻ繝ｻ・･驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｭ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・Δ譎｢・ｽ・ｻ鬩搾ｽｵ繝ｻ・ｺ髫ｲ・ｷ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ郢晢ｽｻ髮懶ｽ｣繝ｻ・ｽ繝ｻ・ｦ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ髯橸ｽｳ陞滂ｽｲ繝ｻ・ｽ繝ｻ・ｰ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｵ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｫ鬮ｯ讖ｸ・ｽ・ｳ髣費｣ｰ繝ｻ・･鬯ｯ貊ゑｽｽ・ｭ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｫ繝ｻ・ｰ郢晢ｽｻ繝ｻ・ｰ鬯ｮ・ｯ隲帑ｼ夲ｽｽ・ｼ陞滂ｽｲ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬮ｯ譎｢・ｽ・ｶ髯ｷ・ｻ繝ｻ・ｻ郢晢ｽｻ繝ｻ・ｼ郢晢ｽｻ繝ｻ・ｰ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* SEO鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｯ・ｮ繝ｻ・ｯ髯具ｽｹ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｺ髯区ｻゑｽｽ・･驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・｣髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬯ｮ・ｫ繝ｻ・ｴ髫ｰ・ｫ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｫ・ｴ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｴ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｩ鬮ｫ・ｲ繝ｻ・､髫ｲ讖ｸ・ｽ・ｺ髯橸ｽｳ郢晢ｽｻ・守｢托ｽｭ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬮ｯ・ｷ繝ｻ・ｿ髫ｰ雋ｻ・ｽ・ｶ髮九ｇ・､繧托ｽｽ・ｹ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｫ・ｴ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｴ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｯ・ｮ繝ｻ・｣鬯ｲ繝ｻ・ｼ螟ｲ・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｮ繝ｻ・ｯ髫ｶ轣假ｽ･繝ｻ・ｽ・ｽ繝ｻ・ｻ驛｢・ｧ隰・∞・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｲ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｮ繝ｻ・ｯ髯ｷ闌ｨ・ｽ・ｷ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・｣髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｯ・ｮ繝ｻ・ｯ髯ｷ闌ｨ・ｽ・ｷ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ隲幢ｽｶ繝ｻ・ｽ繝ｻ・ｮ鬮ｫ・ｰ郢晢ｽｻ陷夲ｽｱ郢晢ｽｻ繝ｻ・ｱ髯ｷ鄙ｫ繝ｻ繝ｻ・ｽ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・｣髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬯ｮ・ｫ繝ｻ・ｴ髫ｰ・ｫ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｶ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ驛｢譎｢・ｽ・ｻ驍ｵ・ｺ繝ｻ・､繝ｻ縺､ﾂ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬮｣蛹・ｽｽ・ｳ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬩幢ｽ｢繝ｻ・ｧ髫ｰ繝ｻ竏槭・・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ*/}
        <section className="py-20 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <FadeIn className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諞ｺ螳・Δ譎｢・ｽ・ｻ郢晢ｽｻ陷ｿ謔ｶ貂夂ｹ晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｪ鬮ｯ蛹ｺ・ｺ蛟･繝ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
              </h2>
              <p className="text-text-muted text-lg">
                Reading / Speaking / Writing 鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｩ蟷｢・ｽ・｢髫ｴ荳ｻ繝ｻ隶捺ｻ・碑ｭ趣ｽ｢繝ｻ・ｽ繝ｻ・ｴ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩搾ｽｵ繝ｻ・ｺ鬲・・・ｽ・ｹ髯懆挙萓ｭ郢晢ｽｻ郢晢ｽｻ繝ｻ・｣鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｱ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｬ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｯ・ｩ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｲ鬮ｯ・ｷ・つ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬮ｯ蛹ｺ・ｺ蛟･繝ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｵ髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｮ・ｦ繝ｻ・ｮ髯ｷ・ｷ繝ｻ・ｮ鬮ｦ・｡鬯･・ｴ・取鱒繝ｻ繝ｻ・ｧ鬮ｯ譎｢・ｽ・ｲ郢晢ｽｻ繝ｻ・ｨ郢晢ｽｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ譎｢・ｽ・ｲ郢晢ｽｻ繝ｻ・ｨ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/reading"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Book className="w-5 h-5 text-primary" />
                Reading hub
              </Link>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Mic className="w-5 h-5 text-primary" />
                Speaking hub
              </Link>
              <Link
                href="/writing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-primary/40 transition-colors"
              >
                <Icons.Pencil className="w-5 h-5 text-primary" />
                Writing hub
              </Link>
              <Link
                href="/speaking/topics/work-study"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                Work &amp; Study (Speaking)
              </Link>
              <Link
                href="/writing/task2/topics/education"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-border text-text font-medium hover:bg-surface hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                Education (Writing Task 2)
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* Pricing 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ - #pricing 鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｯ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｮ・ｮ闕ｵ譏ｴ繝ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｷ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｯ・ｯ繝ｻ・ｪ郢晢ｽｻ繝ｻ・ｰ鬮ｯ・ｷ髣鯉ｽｨ繝ｻ・ｽ繝ｻ・ｷ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｯ・ｮ繝ｻ・ｫ郢晢ｽｻ繝ｻ・ｨ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｶ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｫ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｯ・ｯ繝ｻ・ｨ郢晢ｽｻ繝ｻ・ｾ鬮｣蜴・ｽｽ・ｫ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・｣鬮ｫ・ｲ隶厄ｽｸ繝ｻ・ｽ繝ｻ・ｺ鬮ｯ讖ｸ・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｯ蜈ｷ・ｽ・ｹ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢繝ｻ・ｧ髫ｰ繝ｻ竏槭・・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｮ鬮ｯ蜈ｷ・ｽ・ｹ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｻ鬮ｫ・ｴ陷ｿ蜴・ｽｽ・ｩ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｨ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｾ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｯ郢晢ｽｻ繝ｻ・ｮ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ*/}
        <section
          id="pricing"
          className="py-24 bg-surface border-y border-border scroll-mt-24"
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeIn className="text-center mb-12">
              <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                Pricing
              </h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto">
                鬯ｮ・ｴ陷ｿ蜴・ｽｽ・ｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｡鬯ｮ・ｫ繝ｻ・ｴ驕ｶ荵怜旭陷・ｽｽ鬩搾ｽｵ繝ｻ・ｲ髯懶ｽ｣繝ｻ・､郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ蛹ｺ・ｻ繧托ｽｽ・ｽ繝ｻ・･驛｢譎｢・ｽ・ｻ驕ｶ謫ｾ・ｽ・ｫ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ闕ｵ諤懈ｬｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｿ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｦ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｣繝ｻ・ｺ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｮ荵昴・遶乗ｧｭ繝ｻ繝ｻ・ｽ鬯ｮ・ｯ繝ｻ・ｰI鬯ｩ蟷｢・ｽ・｢髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ竏ｫ・ｵ・ｶ髫伜､懶ｽｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩搾ｽｵ繝ｻ・ｺ鬯ｩ・｢隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ鬮ｯ・ｷ繝ｻ・ｻ髣費｣ｰ繝ｻ・･驛｢譎｢・ｽ・ｱ鬯ｮ・ｯ雋頑瑳・ｱ螢ｹ繝ｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｮ繝ｻ・ｦ郢晢ｽｻ繝ｻ・ｪ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="grid md:grid-cols-2 gap-8">
              {/* Free */}
              <div className="rounded-2xl border-2 border-border bg-surface-2 p-8 flex flex-col">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 mb-3 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    Free
                  </div>
                  <div className="text-3xl font-bold text-text mb-1">驛｢譎｢・ｽ・ｻ驛｢・ｧ隰・∞・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・･0</div>
                  <div className="text-sm text-text-muted">/ month</div>
                </div>
                <div className="mb-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-2 uppercase tracking-wider">
                      Daily limits
                    </h4>
                    <ul className="space-y-1 text-sm text-text-muted">
                      <li>鬯ｩ蛹・ｽｽ・ｯ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢ Writing AI: up to 10/day</li>
                      <li>鬯ｩ蛹・ｽｽ・ｯ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢ Speaking AI: up to 5/day</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-2 uppercase tracking-wider">
                      Included
                    </h4>
                    <ul className="space-y-2">
                      {['Practice (PREP / drills)', 'Exam mode (basic)', 'Recent progress history'].map(
                        (item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-text">{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="mt-auto w-full py-3 px-4 border-2 border-border bg-surface text-text font-semibold rounded-lg hover:bg-surface-2 transition-colors"
                >
                  Start free
                </button>
              </div>

              {/* Pro - 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｰ郢晢ｽｻ繝ｻ・ｨ鬯ｯ・ｲ隰・∞・ｽ・ｽ繝ｻ・ｴ郢晢ｽｻ邵ｺ・､・つ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯ｷ・ｿ鬮｢ﾂ繝ｻ・ｾ陷会ｽｱ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｯ・ｩ隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｵ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｲ鬯ｮ・ｯ隲幢ｽｶ繝ｻ・ｽ繝ｻ・｣驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ郢晢ｽｻ陞ｳ闌ｨ・ｽ・｢隰・∞・ｽ・ｽ繝ｻ・ｭ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髣包ｽｳ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ鬮ｫ・ｶ隰撰ｽｺ繝ｻ・ｺ陋滂ｽ･郢晢ｽｻ鬮｣蛹・ｽｽ・ｳ郢晢ｽｻ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯昴・・・ｹ晢ｽｻ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｢鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・｣鬮ｯ・ｷ繝ｻ・ｴ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ*/}
              <div className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-600 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/70 dark:to-blue-950/60 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Recommended
                </div>
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 text-xs font-bold">
                    PRO
                  </div>
                  <div className="text-3xl font-bold text-text mb-1">
                    Pro pricing
                  </div>
                  <div className="text-sm text-text-muted">
                    Monthly / annual billing
                  </div>
                </div>
                <div className="mb-6 space-y-4">
                  <ul className="space-y-2">
                    {[
                      'Writing / Speaking AI with expanded access,',
                      'More room for repeated practice,',
                      'Full feedback review access',
                      'Priority for deeper practice loops',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icons.Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="mt-auto w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 text-center"
                >
                  Upgrade to Pro
                </Link>
                <p className="mt-3 text-center">
                  <Link
                    href="/pro/request"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                  >
                    Need manual approval? Request Pro
                  </Link>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-8 text-center text-sm text-text-muted">
              <p>
                Secure checkout powered by Stripe.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* About 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ */}
        <section id="about" className="py-24 bg-surface border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  About Meridian
                </h2>
                <p className="text-text-muted text-lg">
                  Meridian 鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｯ鬩搾ｽｵ繝ｻ・ｲ驍ｵ・ｲ繝ｻ繝ｻ鬩幢ｽ｢繝ｻ・ｧ髯ｷ・ｻ髣鯉ｽｨ繝ｻ・ｽ繝ｻ・ｴ郢晢ｽｻ繝ｻ・ｻ鬯ｨ・ｾ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｨ鬩搾ｽｵ繝ｻ・ｺ髯ｷ莨夲ｽｽ・ｱ驕ｯ・ｶ繝ｻ・ｻ IELTS 鬮ｯ譏ｴ繝ｻ繝ｻ・ｽ繝ｻ・ｦ鬯ｩ諤憺它郢晢ｽｻ郢晢ｽｻ陜｣・､繝ｻ・ｹ繝ｻ・ｧ髯具ｽｹ繝ｻ・ｻ郢晢ｽｻ鬯倅ｿｶﾂ・ｦ郢晢ｽｻ繝ｻ・ｷ鬮｣蜴・ｽｽ・ｴ鬯ｪ・ｰ陷ｿ・･鬯滂ｽｭ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｯ髯橸ｽ｢繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｰ鬩幢ｽ｢繝ｻ・ｧ驛｢譎｢・ｽ・ｻ髫ｨ蛟･繝ｻ繝ｻ・ｸ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ郢ｧ莨夲ｽｽ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｮ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｫ鬩搾ｽｵ繝ｻ・ｺ髯ｷ・ｷ繝ｻ・ｶ郢晢ｽｻ霑｢證ｦ・ｽ・ｸ繝ｻ・ｺ髮九・竏槭・・ｽ遶擾ｽｫ繝ｻ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｮ鬮ｯ譏ｴ繝ｻ繝ｻ・ｽ繝ｻ・ｦ鬯ｩ諤憺它郢晢ｽｻ驍ｵ・ｺ驕会ｽｼ繝ｻ・ｹ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｼ鬩幢ｽ｢隴寂或・ｾ・ｭ驍ｵ・ｺ陝ｶ・ｷ繝ｻ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬩搾ｽｵ繝ｻ・ｺ髯ｷ・ｷ繝ｻ・ｶ繝ｻ縺､ﾂ驛｢譎｢・ｽ・ｻ
                </p>
              </FadeIn>
              
              <div className="space-y-12">
                <FadeIn delay={0.1}>
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      Mission
                    </h3>
                    <p className="text-text-muted leading-relaxed bg-surface-2 p-6 rounded-xl border border-border">
                      Meridian 鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｯ鬩搾ｽｵ繝ｻ・ｲ驍ｵ・ｲ繝ｻ繝ｻ鬩幢ｽ｢繝ｻ・ｧ髯ｷ・ｻ髣鯉ｽｨ繝ｻ・ｽ繝ｻ・ｴ郢晢ｽｻ繝ｻ・ｻ鬯ｨ・ｾ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｨ鬩搾ｽｵ繝ｻ・ｺ髯ｷ莨夲ｽｽ・ｱ驕ｯ・ｶ繝ｻ・ｻ IELTS 鬮ｯ譏ｴ繝ｻ繝ｻ・ｽ繝ｻ・ｦ鬯ｩ諤憺它郢晢ｽｻ郢晢ｽｻ陜｣・､繝ｻ・ｹ繝ｻ・ｧ髯具ｽｹ繝ｻ・ｻ郢晢ｽｻ鬯倅ｿｶﾂ・ｦ郢晢ｽｻ繝ｻ・ｷ鬮｣蜴・ｽｽ・ｴ鬯ｪ・ｰ陷ｿ・･鬯滂ｽｭ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬯ｩ謳ｾ・ｽ・ｯ髯橸ｽ｢繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｰ鬩幢ｽ｢繝ｻ・ｧ驛｢譎｢・ｽ・ｻ髫ｨ蛟･繝ｻ繝ｻ・ｸ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ郢ｧ莨夲ｽｽ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｮ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｫ鬩搾ｽｵ繝ｻ・ｺ髯ｷ・ｷ繝ｻ・ｶ郢晢ｽｻ霑｢證ｦ・ｽ・ｸ繝ｻ・ｺ髮九・竏槭・・ｽ遶擾ｽｫ繝ｻ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｮ鬩幢ｽ｢隴惹ｸ橸ｽｹ・ｲ繝ｻ荳ｻ・ｸ・ｷ繝ｻ・ｹ隴擾ｽｴ郢晢ｽｻ驛｢譎｢・ｽ・ｨ鬩幢ｽ｢隴弱・・ｽ・ｼ隴・搨・ｰ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｼ鬩幢ｽ｢隴趣ｽ｢繝ｻ・｣繝ｻ・ｰ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬩搾ｽｵ繝ｻ・ｺ髯ｷ・ｷ繝ｻ・ｶ繝ｻ縺､ﾂ驛｢譎｢・ｽ・ｻ
                      鬮ｯ・ｷ鬮ｮ繝ｻﾂ繝ｻ・･驕ｶ莨√・繝ｻ・ｹ繝ｻ・ｧ髯具ｽｹ繝ｻ・ｺ髮取腸・ｽ・ｻ鬮ｴ髮｣・ｽ・､郢晢ｽｻ繝ｻ・ｹ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｯ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｪ鬩搾ｽｵ繝ｻ・ｺ髣包ｽｳ霑ｺ・ｰ・つ驕ｶ荳橸ｽ｣・ｹ・趣ｽｨ鬩幢ｽ｢繝ｻ・ｧ郢晢ｽｻ繝ｻ・｣鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｼ鬩幢ｽ｢隴取得・ｽ・ｳ繝ｻ・ｨ驛｢譎｢・ｽ・ｰ鬩幢ｽ｢隴擾ｽｴ郢晢ｽｻ驍ｵ・ｺ鬩｢謳ｾ・ｽ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴擾ｽｴ郢晢ｽｻ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢繝ｻ・ｧ郢晢ｽｻ繝ｻ・ｿ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｫ鬩幢ｽ｢繝ｻ・ｧ驛｢・ｧ郢晢ｽｻ郢晢ｽｻ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・･鬩搾ｽｵ繝ｻ・ｺ髣包ｽｳ隶厄ｽｸ繝ｻ・ｽ繝ｻ・ｭ郢晢ｽｻ繝ｻ・ｦ鬯ｩ諤懈純繝ｻ・ｲ隶厄ｽｸ繝ｻ・ｽ繝ｻ・ｰ髯橸ｽｳ髣鯉ｽｨ繝ｻ・ｽ繝ｻ・ｷ髯橸ｽ｢繝ｻ・ｹ郢晢ｽｻ陜｣・､繝ｻ・ｹ繝ｻ・ｧ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴擾ｽｴ郢晢ｽｻ驛｢譎｢・ｽ・ｨ鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｧ鬮ｫ・ｰ繝ｻ・ｰ鬮ｯ諛会ｽｼ螟ｲ・ｽ・ｽ繝ｻ・ｾ髯晢ｽｶ陷ｻ・ｻ繝ｻ・ｼ繝ｻ・ｰ鬩搾ｽｵ繝ｻ・ｲ驕ｶ荵怜款繝ｻ・ｽ繝ｻ・ｮ髮狗ｿｫ繝ｻ隲､蜥弱＠繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｮ鬩幢ｽ｢繝ｻ・ｧ郢晢ｽｻ繝ｻ・ｹ鬩幢ｽ｢繝ｻ・ｧ郢晢ｽｻ繝ｻ・ｳ鬩幢ｽ｢繝ｻ・ｧ郢晢ｽｻ繝ｻ・｢鬮ｫ・ｰ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｹ鬮ｯ諛茨ｽｺ蛟･繝ｻ驕ｶ莨∬ｱｪ繝ｻ・ｸ繝ｻ・ｺ郢晢ｽｻ繝ｻ・､鬩搾ｽｵ繝ｻ・ｺ郢晢ｽｻ繝ｻ・ｪ鬩搾ｽｵ繝ｻ・ｺ髯句ｹ｢・ｽ・ｵ驕ｶ謫ｾ・ｽ・ｪ鬩搾ｽｵ繝ｻ・ｺ髯ｷ・ｷ繝ｻ・ｶ繝ｻ縺､ﾂ驛｢譎｢・ｽ・ｻ
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.2}>
                  <div>
                    <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      Tech stack
                    </h3>
                    <StaggerContainer className="grid md:grid-cols-2 gap-4" staggerDelay={0.1}>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Frontend</div>
                          <div className="text-sm text-text-muted">Next.js 14, React, TypeScript, Tailwind CSS</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Backend</div>
                          <div className="text-sm text-text-muted">Supabase (PostgreSQL), Next.js API Routes</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">AI/LLM</div>
                          <div className="text-sm text-text-muted">Groq, OpenAI (GPT-4o-mini)</div>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="bg-surface-2 rounded-xl p-5 border border-border">
                          <div className="font-semibold text-text mb-2">Other</div>
                          <div className="text-sm text-text-muted">Zod (validation), SRS algorithms</div>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Contact 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻoogle Forms 鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｫ・ｲ陝ｶ蜷ｶ繝ｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｬ鬯ｮ・ｮ隲幢ｽｶ繝ｻ・ｽ繝ｻ・｣驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬯ｮ・ｫ繝ｻ・ｲ郢晢ｽｻ繝ｻ・ｱ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｯ・ｯ繝ｻ・ｩ髫ｰ・ｳ繝ｻ・ｾ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｵ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ + 鬯ｯ・ｯ繝ｻ・ｮ郢晢ｽｻ繝ｻ・ｯ鬮ｯ・ｷ髣鯉ｽｨ繝ｻ・ｽ繝ｻ・ｷ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・･鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ驛｢譎｢・ｽ・ｻ郢晢ｽｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｧ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬮ｯ・ｷ繝ｻ・ｿ髫ｰ雋ｻ・ｽ・ｶ髮九ｇ・､繧托ｽｽ・ｹ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｳ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｯ + mailto鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ鬯ｯ・ｩ陝ｷ・｢繝ｻ・ｽ繝ｻ・｢鬮ｫ・ｴ髮懶ｽ｣繝ｻ・ｽ繝ｻ・｢驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｻ*/}
        <section id="contact" className="py-24 bg-bg-secondary scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <FadeIn className="text-center mb-12">
                <h2 className="text-heading-2 font-bold tracking-tight text-text mb-4">
                  Contact
                </h2>
                <p className="text-text-muted text-lg">
                  鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蜍滉ｺ芽ｱ主｣ｹ繝ｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｪ鬯ｮ・ｯ隲幢ｽｶ繝ｻ・｣繝ｻ・ｰ鬮｣蛹・ｽｽ・ｳ髯槭ｅ繝ｻ繝ｻ・ｽ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ竏ｫ・ｵ・ｶ髫伜､懶ｽｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩搾ｽｵ繝ｻ・ｺ鬯ｩ・｢隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｯ貅ｷ萓帙・・ｨ繝ｻ・ｯ髫ｴ魃会ｽｽ・ｺ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ貅ｷ萓帙・・ｾ陟募ｾ後・鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｩ蜍淞繝ｻ・ｽ・ｼ陷ｿ・ｯ・つ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｣鬯ｯ・ｩ隰ｳ・ｾ繝ｻ・ｽ繝ｻ・ｨ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮｣蛹・ｽｽ・ｳ髯晢ｽｯ繝ｻ・ｩ髯ｷ・ｻ繝ｻ・ｳ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｮ・ｴ鬩帙・・ｽ・ｲ繝ｻ・ｻ郢晢ｽｻ繝ｻ・ｼ髫ｶ謐ｺ諷｣繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｲ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                </p>
                {userId && (
                  <p className="mt-2 text-sm text-text-muted">
                    鬯ｯ・ｨ繝ｻ・ｾ髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬯ｮ・｣陜難ｽｼ陞ｻ・ｮ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ蜿･・ｹ・｢繝ｻ・ｽ繝ｻ・ｵ鬩搾ｽｵ繝ｻ・ｺ髯晢ｽｶ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｺ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ驛｢譎｢・ｽ・ｻ髴托ｽ｢隴会ｽｦ繝ｻ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｮ荵昴・遶乗ｧｭ繝ｻ繝ｻ・ｽ驕ｶ謫ｾ・ｽ・ｫ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｲ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｢郢晢ｽｻ・つ繝ｻ・｡郢晢ｽｻ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｶ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼID鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬮ｯ讖ｸ・ｽ・ｳ髯橸ｽ｢繝ｻ・ｹ驛｢譎｢・ｽ・ｻ鬯ｮ・ｯ繝ｻ・ｷ髯晢｣ｰ髮懶ｽ｣繝ｻ・ｽ繝ｻ・ｼ髫ｴ繝ｻ謳ｨ・つ髯懶ｽ｣繝ｻ・､郢晢ｽｻ繝ｻ・ｹ髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ繝ｻ謳ｨ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｰ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｷ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ鬩包ｽｶ闕ｳ讖ｸ・ｽ・｣繝ｻ・ｺ繝ｻ縺､ﾂ郢晢ｽｻ繝ｻ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩包ｽｶ隰ｫ・ｾ繝ｻ・ｽ繝ｻ・ｪ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ・ｷ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｶ郢晢ｽｻ邵ｺ・､・つ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
                  </p>
                )}
              </FadeIn>
              <FadeIn delay={0.1} className="space-y-4">
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                  <iframe
                    src={buildContactGoogleFormUrl({ userId, embedded: true })}
                    title="Contact form"
                    className="w-full border-0"
                    style={{ height: 'min(1000px, 90vh)' }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <a
                    href={buildContactGoogleFormUrl({ userId, embedded: false })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    Open in a new tab
                  </a>
                  {CONTACT_EMAIL && CONTACT_EMAIL !== 'support@example.com' && (
                    <a href={CONTACT_MAILTO} className="text-text-muted hover:text-text transition-colors">
                      Contact by email
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      </main>

      {/* 鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ髯滓汚・ｽ・ｱ驛｢譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ鬯ｮ・ｫ繝ｻ・ｴ驕ｶ謫ｾ・ｽ・ｫ髮趣ｽｬ繝ｻ・ｹ鬮ｫ・ｴ闔ｨ螟ｲ・ｽ・ｽ繝ｻ・ｮ郢晢ｽｻ陷ｿ螟懶ｽｱ蝣､・ｹ譎｢・ｽ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬯ｯ・ｯ繝ｻ・ｩ髯晢ｽｷ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬯ｮ・ｫ繝ｻ・ｴ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｼ */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <BrandLink
                href="/"
                size={32}
                textClassName="text-lg"
                linkClassName="mb-4 transition-opacity duration-200 hover:opacity-90"
              />
               <p className="text-sm text-text-muted leading-relaxed">
                 AI鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｧ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｦ鬯ｯ・ｩ隲､諛育ｴ皮ｹ晢ｽｻ繝ｻ・ｲ髫ｶ蜴・ｽｽ・ｸ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｰ鬮ｯ讖ｸ・ｽ・ｳ鬮｣魃会ｽｽ・ｨ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｷ鬮ｯ讖ｸ・ｽ・｢郢晢ｽｻ繝ｻ・ｹ驛｢譎｢・ｽ・ｻ髯懶ｽ｣繝ｻ・､郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｵ鬯ｩ蟷｢・ｽ・｢髫ｴ蠑ｱ繝ｻ繝ｻ・ｺ繝ｻ・｢鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ荳ｻ繝ｻ隶捺ｻ・惺陋滂ｽ･郢晢ｽｻ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻIELTS 鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｯ・ｩ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｲ鬮ｫ・ｰ髮具ｽｻ繝ｻ・ｽ繝ｻ・ｶ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｩ鬯ｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｨ鬯ｩ蟷｢・ｽ・｢髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ繝ｻ謳ｨ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｼ鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・｣郢晢ｽｻ繝ｻ・ｰ
               </p>
            </div>
            
            <div className="md:col-start-3">
              <h4 className="font-bold text-text mb-4 text-sm">Service</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Pricing
                  </button>
                </li>
                <li>
                  <Link href="/speaking" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                    Speaking hub
                  </Link>
                </li>
                <li>
                  <Link href="/writing" className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                    Writing hub
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text mb-4 text-sm">Other</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    About
                  </button>
                </li>
                <li>
                  <Link 
                    href={BLOG_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text-subtle">
              郢晢ｽｻ郢ｧ謇假ｽｽ・ｽ繝ｻ・ｩ {new Date().getFullYear()} Meridian. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-text-subtle">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-text transition-colors text-text-muted">
                Privacy Policy
              </button>
              <button onClick={() => setShowTermsOfService(true)} className="hover:text-text transition-colors text-text-muted">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy modal */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowPrivacyPolicy(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <h2 className="text-2xl font-bold text-text">Privacy Policy</h2>
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(false)}
                className="text-text-muted transition-colors hover:text-text"
                aria-label="Close Privacy Policy"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6 px-6 py-8 text-text">
              {PRIVACY_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-3 text-lg font-bold text-text">{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {'bullets' in section && section.bullets ? (
                    <ul className="ml-4 mt-3 list-disc list-inside space-y-1 text-text-muted">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service modal */}
      {showTermsOfService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowTermsOfService(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <h2 className="text-2xl font-bold text-text">Terms of Service</h2>
              <button
                type="button"
                onClick={() => setShowTermsOfService(false)}
                className="text-text-muted transition-colors hover:text-text"
                aria-label="Close Terms of Service"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6 px-6 py-8 text-text">
              {TERMS_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-3 text-lg font-bold text-text">{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {'bullets' in section && section.bullets ? (
                    <ul className="ml-4 mt-3 list-disc list-inside space-y-1 text-text-muted">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-text-muted">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
