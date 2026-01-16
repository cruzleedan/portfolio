import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { ArrowRight } from 'lucide-react';

// Polyfill Buffer for browser
(window as any).Buffer = Buffer;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Import all markdown files from posts directory
    const loadPosts = async () => {
      const postModules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default' });
      const loadedPosts: BlogPost[] = [];

      for (const path in postModules) {
        const content = await postModules[path]();
        const { data } = matter(content as string);
        const slug = path.replace('/posts/', '').replace('.md', '');

        loadedPosts.push({
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          tags: data.tags || [],
        });
      }

      // Sort by date, newest first
      loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  const recentPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold">Latest Posts</h2>
          <Link
            to="/blog"
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-12">
          Technical articles and thoughts on software development.
        </p>

        <div className="space-y-8">
          {recentPosts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Coming soon!</p>
          ) : (
            recentPosts.map((post) => (
              <article key={post.slug} className="border-b pb-8">
                <Link to={`/blog/${post.slug}`} className="group">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-3">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
