import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { Search, X, Clock, Tag } from 'lucide-react';

// Polyfill Buffer for browser
(window as any).Buffer = Buffer;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  readingTime: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  architecture: 'Architecture',
  networking: 'Networking',
  'ai-integration': 'AI Integration',
  'ai-agentic-sdlc': 'AI & Agentic SDLC',
  testing: 'Testing',
  deployment: 'Deployment',
  'dev-experience': 'Developer Experience',
  security: 'Security',
  'hiring-and-interviews': 'Hiring & Interviews',
  'feature-deep-dives': 'Feature Deep Dives',
  'sso-enterprise-auth': 'SSO & Enterprise Auth',
  'flutter-migration-journey': 'Flutter Migration Journey',
  general: 'General',
};

const CATEGORY_COLORS: Record<string, string> = {
  architecture: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  networking: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'ai-integration': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'ai-agentic-sdlc': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  testing: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  deployment: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'dev-experience': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  security: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'hiring-and-interviews': 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'feature-deep-dives': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'sso-enterprise-auth': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'flutter-migration-journey': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const CATEGORY_ORDER = [
  'flutter-migration-journey',
  'architecture',
  'feature-deep-dives',
  'ai-integration',
  'ai-agentic-sdlc',
  'sso-enterprise-auth',
  'networking',
  'testing',
  'deployment',
  'dev-experience',
  'security',
  'hiring-and-interviews',
  'general',
];

function CategoryBadge({ category }: { category: string }) {
  const label = CATEGORY_LABELS[category] ?? category;
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col h-full bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <CategoryBadge category={post.category} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readingTime}
        </span>
      </div>
      <Link to={`/blog/${post.slug}`} className="flex-1">
        <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {post.excerpt}
        </p>
      </Link>
      <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
        <time className="text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap justify-end">
            <Tag className="w-3 h-3 text-muted-foreground shrink-0" />
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                {tag}{post.tags.indexOf(tag) < Math.min(post.tags.length, 3) - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      const postModules = import.meta.glob('/posts/articles/**/*.md', { query: '?raw', import: 'default' });
      const loadedPosts: BlogPost[] = [];

      for (const path in postModules) {
        const content = await postModules[path]();
        const { data } = matter(content as string);
        const slug = path.replace('/posts/articles/', '').replace('.md', '');
        const category = slug.split('/')[0];

        loadedPosts.push({
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || data.description || '',
          tags: data.tags || [],
          category,
          readingTime: data.reading_time || '',
        });
      }

      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  // Ordered list of categories that actually have posts
  const categories = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    // Append any unknown categories
    posts.forEach((p) => {
      if (!CATEGORY_ORDER.includes(p.category) && !ordered.includes(p.category)) {
        ordered.push(p.category);
      }
    });
    return ordered;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, selectedCategory, searchQuery]);

  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '';

  // Group by category when showing everything unfiltered
  const grouped = useMemo(() => {
    if (isFiltered) return null;
    return CATEGORY_ORDER.reduce<Record<string, BlogPost[]>>((acc, cat) => {
      const items = filteredPosts.filter((p) => p.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    }, {});
  }, [filteredPosts, isFiltered]);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">
            {posts.length} articles on Flutter, architecture, AI integration, and engineering craft.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, topic, or tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
              }`}
          >
            All <span className="opacity-70">({posts.length})</span>
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? 'all' : cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                  }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}{' '}
                <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No articles found</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : isFiltered ? (
          // Flat card grid when filtered or searching
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'all' ? ` in ${CATEGORY_LABELS[selectedCategory] ?? selectedCategory}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ) : (
          // Grouped by category when browsing all
          <div className="space-y-12">
            {grouped && Object.entries(grouped).map(([cat, catPosts]) => (
              <section key={cat}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-bold">{CATEGORY_LABELS[cat] ?? cat}</h2>
                  <CategoryBadge category={cat} />
                  <span className="text-sm text-muted-foreground ml-auto">
                    {catPosts.length} {catPosts.length === 1 ? 'article' : 'articles'}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="text-sm text-primary hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;
