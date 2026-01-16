import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser
(window as any).Buffer = Buffer;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Import all markdown files from posts directory
    const loadPosts = async () => {
      const postModules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default' });
      console.log('Found post modules:', Object.keys(postModules));
      const loadedPosts: BlogPost[] = [];

      for (const path in postModules) {
        const content = await postModules[path]();
        const { data } = matter(content as string);
        console.log('Loaded post:', path, 'Data:', data);
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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Technical articles and thoughts on software development.
        </p>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Coming soon!</p>
          ) : (
            posts.map((post) => (
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
    </div>
  );
};

export default BlogList;
