import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { ArrowLeft, Clock } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';

(window as any).Buffer = Buffer;

interface PostData {
  title: string;
  date: string;
  tags: string[];
  content: string;
}

interface PostListItem {
  slug: string;
  title: string;
  date: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [allPosts, setAllPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const isScrollingRef = useRef(false);

  // Memoize components to prevent re-rendering on activeId change
  const markdownComponents = useMemo(() => ({
    code(props: any) {
      const { node, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language === 'mermaid') {
        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
      }

      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }
  }), []);

  // Extract table of contents from markdown
  const extractToc = (markdown: string): TocItem[] => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Convert heading to slug (same as react-markdown does)
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      items.push({ id, text, level });
    }

    return items;
  };

  // Track active section while scrolling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Skip tracking if user initiated smooth scroll
      if (isScrollingRef.current) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const headings = toc.map(item => document.getElementById(item.id)).filter(Boolean);
        let currentActiveId = '';

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          if (heading && heading.getBoundingClientRect().top <= 150) {
            currentActiveId = heading.id;
            break;
          }
        }

        setActiveId(prev => prev !== currentActiveId ? currentActiveId : prev);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [toc]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadAllPosts = async () => {
      const postModules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default' });
      const loadedPosts: PostListItem[] = [];

      for (const path in postModules) {
        const content = await postModules[path]();
        const { data } = matter(content as string);
        const postSlug = path.replace('/posts/', '').replace('.md', '');

        loadedPosts.push({
          slug: postSlug,
          title: data.title,
          date: data.date,
        });
      }

      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllPosts(loadedPosts);
    };

    loadAllPosts();
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default' });
        const postPath = `/posts/${slug}.md`;
        const loader = modules[postPath];

        if (!loader) {
          throw new Error('Post not found');
        }

        const content = await loader() as string;
        const { data, content: markdownContent } = matter(content);

        setPost({
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          content: markdownContent,
        });

        // Extract table of contents
        setToc(extractToc(markdownContent));
      } catch (error) {
        console.error('Error loading post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Sidebar - Other Posts */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <Link to="/blog" className="text-primary hover:underline inline-flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                All Posts
              </Link>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                Other Posts
              </h3>
              <nav className="space-y-2">
                {allPosts.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className={`block p-3 rounded-lg transition-colors ${p.slug === slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'}`}
                  >
                    <div className="text-sm line-clamp-2 mb-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <article className="flex-1 max-w-3xl">
            <Link to="/blog" className="lg:hidden text-primary hover:underline inline-flex items-center gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-muted-foreground mb-4">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Right Sidebar - Table of Contents */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  On This Page
                </h3>
                <nav className="space-y-2 pr-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        isScrollingRef.current = true;

                        const element = document.getElementById(item.id);
                        if (element) {
                          const yOffset = -100;
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });

                          // Re-enable scroll tracking after smooth scroll completes
                          setTimeout(() => {
                            isScrollingRef.current = false;
                            setActiveId(item.id);
                          }, 1000);
                        }
                      }}
                      className={`block text-sm transition-colors py-1 border-l-2 pl-3 ${activeId === item.id
                        ? 'border-primary text-primary font-medium'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                        } ${item.level === 3 ? 'pl-6' : ''}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
