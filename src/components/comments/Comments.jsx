'use client';
import Link from 'next/link';
import styles from './Comments.module.css';
import Image from 'next/image';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Comments = ({ postSlug }) => {
  const { status } = useSession();

  const { data, mutate, isLoading } = useSWR(
    `http://localhost:3000/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  // console.log(postSlug);

  const [desc, setDesc] = useState('');

  const handleSubmit = async () => {
    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ desc, postSlug }),
    });

    mutate(); //to revalidate our data when we add a new comment so we see it
    setDesc('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>

      {status === 'authenticated' ? (
        <div className={styles.write}>
          <textarea
            className={styles.input}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="write a comment..."
          />
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      ) : (
        <Link href="/login" style={{ color: 'lightblue', cursor: 'pointer' }}>
          Login to write a comment
        </Link>
      )}

      <div className={styles.comments}>
        {isLoading
          ? 'Loading'
          : data.map((comment) => (
              <div className={styles.comment} key={comment.id}>
                <div className={styles.user}>
                  {comment.user.image && (
                    <Image
                      src={comment.user.image}
                      alt="user avatar"
                      width={50}
                      height={50}
                      className={styles.image}
                    />
                  )}

                  <div className={styles.userInfo}>
                    <span className={styles.username}>{comment.user.name}</span>
                    <span className={styles.date}>{comment.createdAt}</span>
                  </div>
                </div>
                <p className={styles.desc}>{comment.desc}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Comments;
