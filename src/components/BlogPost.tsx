import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { ArrowLeft, Clock } from 'lucide-react';

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [allPosts, setAllPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
