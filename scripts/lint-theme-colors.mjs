#!/usr/bin/env node
/**
 * テーマカラーの直書き色検出スクリプト
 * 
 * 検出対象:
 * - Tailwind arbitrary values: text-[#, bg-[#, border-[#, from-[#, to-[#, via-[#, ring-[#, outline-[#, shadow-[#
 * - カラー関数: rgb(, rgba(, hsl(, hsla(
 * - inline style: style={{ と color:, background, borderColor 等
 * - hex直書き: # を含む色指定（URLやMarkdownの誤検知を避ける）
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 検索対象ディレクトリ
const TARGET_DIRS = ['app', 'components', 'styles'].filter(dir => {
  const dirPath = join(projectRoot, dir);
  try {
    return statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
});

// 除外ディレクトリ・ファイル
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'out',
  '.git',
  'next-env.d.ts',
];

// 例外ファイル（globals.cssのCSS変数定義など）
const EXCEPTION_FILES = [
  'app/globals.css', // CSS変数定義内のrgb()は許可
];

// 検出パターン
const PATTERNS = [
  // Tailwind arbitrary values
  { pattern: /(text|bg|border|from|to|via|ring|outline|shadow)-\[#/g, name: 'Tailwind arbitrary color' },
  // カラー関数（CSS変数定義内は除外、rgb(var(--...)) は除外）
  { 
    pattern: /\b(rgb|rgba|hsl|hsla)\(/g, 
    name: 'Color function',
    excludePatterns: [
      /rgb\(var\(--/g,  // rgb(var(--...)) は除外（CSS変数参照）
      /rgba\(var\(--/g, // rgba(var(--...)) は除外
      /hsl\(var\(--/g,  // hsl(var(--...)) は除外
      /hsla\(var\(--/g, // hsla(var(--...)) は除外
    ],
  },
  // inline style（style={{ と color:, background, borderColor 等）
  { pattern: /style=\{\{[\s\S]*?(color|background|backgroundColor|borderColor|borderTopColor|borderRightColor|borderBottomColor|borderLeftColor)\s*:/g, name: 'Inline style color' },
  // hex直書き（URLやMarkdownの誤検知を避ける）
  { pattern: /#[0-9a-fA-F]{3,6}\b/g, name: 'Hex color', excludeContexts: [
    /https?:\/\/[^\s]*#/g, // URL内の#を除外
    /\[.*?\]\(#.*?\)/g,    // Markdownリンク [text](#anchor) を除外
    /<!--[\s\S]*?-->/g,     // HTMLコメントを除外
  ]},
];

// 例外コンテキスト（CSS変数定義内など）
const EXCEPTION_CONTEXTS = [
  /--[\w-]+:\s*[^;]+rgb\(/g,  // CSS変数定義内のrgb()
  /:root\s*\{[\s\S]*?\}/g,    // :root { ... }
  /\[data-theme="[^"]+"\]\s*\{[\s\S]*?\}/g, // [data-theme="..."] { ... }
];

/**
 * ファイルを読み込んで検出パターンをチェック
 */
function checkFile(filePath) {
  const issues = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = relative(projectRoot, filePath);
    
    // 例外ファイルかチェック
    const isExceptionFile = EXCEPTION_FILES.some(exception => 
      relativePath.replace(/\\/g, '/').includes(exception.replace(/\//g, '/'))
    );
    
    // 行ごとに処理
    const lines = content.split(/\r?\n/);
    
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      
      // 例外コンテキスト内かチェック（CSS変数定義内など）
      let inExceptionContext = false;
      if (isExceptionFile) {
        // globals.cssの場合、:root や [data-theme="..."] 内を除外
        const beforeLine = lines.slice(0, lineIndex).join('\n');
        const afterLine = lines.slice(0, lineIndex + 1).join('\n');
        
        // :root { ... } 内かチェック
        const rootMatches = beforeLine.match(/:root\s*\{/g) || [];
        const rootCloses = beforeLine.match(/\}/g) || [];
        const isInRoot = rootMatches.length > rootCloses.length;
        
        // [data-theme="..."] { ... } 内かチェック
        const themeMatches = beforeLine.match(/\[data-theme="[^"]+"\]\s*\{/g) || [];
        const themeCloses = beforeLine.match(/\}/g) || [];
        const isInTheme = themeMatches.length > rootCloses.length; // root を除いた閉じ括弧の数
        
        // CSS変数定義内かチェック（--変数名: の行）
        const isCSSVarDef = /--[\w-]+:\s*/.test(line) && /\brgb\(/.test(line);
        
        inExceptionContext = isInRoot || isInTheme || isCSSVarDef;
      }
      
      // パターンをチェック
      PATTERNS.forEach(({ pattern, name, excludeContexts, excludePatterns }) => {
        // 例外コンテキスト内の場合はスキップ（CSS変数定義内など）
        if (inExceptionContext && name === 'Color function') {
          return;
        }
        
        // パターンマッチング
        const matches = [...line.matchAll(pattern)];
        
        matches.forEach(match => {
          const matchText = match[0];
          
          // 除外パターンをチェック（rgb(var(--...))など）
          if (excludePatterns) {
            const shouldExclude = excludePatterns.some(excludePattern => {
              const excludeMatches = [...line.matchAll(excludePattern)];
              return excludeMatches.some(excludeMatch => {
                const excludeStart = excludeMatch.index;
                const excludeEnd = excludeStart + excludeMatch[0].length;
                const matchStart = match.index;
                return matchStart >= excludeStart && matchStart < excludeEnd;
              });
            });
            if (shouldExclude) return;
          }
          
          // 除外コンテキストをチェック（URL、Markdownリンクなど）
          if (excludeContexts) {
            const shouldExclude = excludeContexts.some(excludePattern => {
              const excludeMatches = [...line.matchAll(excludePattern)];
              return excludeMatches.some(excludeMatch => {
                const excludeStart = excludeMatch.index;
                const excludeEnd = excludeStart + excludeMatch[0].length;
                const matchStart = match.index;
                return matchStart >= excludeStart && matchStart < excludeEnd;
              });
            });
            if (shouldExclude) return;
          }
          
          // HTMLコメント内かチェック
          const beforeMatch = line.substring(0, match.index);
          const commentOpen = beforeMatch.lastIndexOf('<!--');
          const commentClose = beforeMatch.lastIndexOf('-->');
          if (commentOpen > commentClose) return; // コメント内
          
          // JSXコメント内かチェック
          const jsxCommentOpen = beforeMatch.lastIndexOf('{/*');
          const jsxCommentClose = beforeMatch.lastIndexOf('*/}');
          if (jsxCommentOpen > jsxCommentClose) return; // JSXコメント内
          
          issues.push({
            file: relativePath,
            line: lineNumber,
            column: match.index + 1,
            pattern: name,
            match: matchText,
            code: line.trim(),
          });
        });
      });
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
  
  return issues;
}

/**
 * ディレクトリを再帰的に走査
 */
function walkDir(dir, issues = []) {
  const entries = readdirSync(dir);
  
  entries.forEach(entry => {
    const fullPath = join(dir, entry);
    
    // 除外パターンをチェック
    if (IGNORE_PATTERNS.some(pattern => entry.includes(pattern))) {
      return;
    }
    
    try {
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath, issues);
      } else if (stat.isFile()) {
        // 対象ファイルのみチェック（.tsx, .ts, .jsx, .js, .css）
        const ext = entry.split('.').pop();
        if (['tsx', 'ts', 'jsx', 'js', 'css'].includes(ext)) {
          const fileIssues = checkFile(fullPath);
          issues.push(...fileIssues);
        }
      }
    } catch (error) {
      // 権限エラーなどは無視
    }
  });
  
  return issues;
}

/**
 * メイン処理
 */
function main() {
  console.log('🔍 Checking for hardcoded colors...\n');
  console.log(`Target directories: ${TARGET_DIRS.join(', ')}\n`);
  
  const allIssues = [];
  
  TARGET_DIRS.forEach(dir => {
    const dirPath = join(projectRoot, dir);
    const issues = walkDir(dirPath);
    allIssues.push(...issues);
  });
  
  if (allIssues.length === 0) {
    console.log('✅ No hardcoded colors found!');
    process.exit(0);
  }
  
  console.error(`❌ Found ${allIssues.length} hardcoded color(s):\n`);
  
  // ファイルごとにグループ化
  const issuesByFile = {};
  allIssues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });
  
  // エラーを出力
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.error(`\n📄 ${file}`);
    issues.forEach(issue => {
      console.error(`  ${issue.line}:${issue.column} - ${issue.pattern}`);
      console.error(`    ${issue.match} in: ${issue.code}`);
    });
  });
  
  console.error(`\n❌ Total: ${allIssues.length} issue(s)`);
  console.error('\n💡 Tip: Use design tokens instead of hardcoded colors.');
  console.error('   Example: bg-primary instead of bg-[#4f46e5]');
  console.error('   See THEME_RULES.md for details.');
  
  process.exit(1);
}

main();
