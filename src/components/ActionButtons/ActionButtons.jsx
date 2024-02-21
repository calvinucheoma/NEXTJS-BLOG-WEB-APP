'use client';
import { useState } from 'react';
import styles from './ActionButtons.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ActionButtons = ({ slug, postOwner }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data } = useSession();

  // console.log(slug);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/'); // Redirect to home page after successful deletion
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/edit/${slug}`); // Navigate to the write page with slug as parameter for editing
  };
  return (
    <>
      {postOwner === data?.user?.email ? (
        <div className={styles.actionButtons}>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ActionButtons;
