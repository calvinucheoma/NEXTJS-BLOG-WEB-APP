import Card from '../card/Card';
import Pagination from '../pagination/Pagination';
import styles from './CardList.module.css';

const getData = async (page, cat) => {
  const res = await fetch(
    `http://localhost:3000/api/posts?page=${page}&cat=${cat || ''}`,
    {
      cache: 'no-store', // by default, nextJS caches our request but we do not want that as we always want to display fresh data
    }
  );

  if (!res.ok) {
    throw new Error('Failed');
  }

  return res.json();
};

const CardList = async ({ page, cat }) => {
  const data = await getData(page, cat);

  const { posts, count } = data;

  // console.log(posts, count);

  const POST_PER_PAGE = 2;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;

  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {posts?.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;
