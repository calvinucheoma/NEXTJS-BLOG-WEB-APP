'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './writePage.module.css';
//import ReactQuill from 'react-quill'; //gives us an error when trying to build the project due to server side rendering of Nextjs so we have to import it dynamically
import 'react-quill/dist/quill.bubble.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '@/utils/firebase';
import dynamic from 'next/dynamic';

const WritePage = () => {
  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState('');
  const [title, setTitle] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);

  const { status } = useSession();

  const router = useRouter();

  // console.log(file);

  useEffect(() => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewURL(preview);
    }
  }, [file]);

  useEffect(() => {
    return () => {
      // Clean up the URL object when component unmounts
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  useEffect(() => {
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };

    if (file && !media) {
      // Upload the image only when a new file is selected and media is not already set
      upload();
    }
  }, [file, media]);

  // const handleImageUpload = async () => {
  //   const storage = getStorage(app);

  //   const name = new Date().getTime() + file.name; //to create a unique name for our image file in case two images have the same name

  //   const storageRef = ref(storage, name);

  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log('Upload is ' + progress + '% done');
  //       switch (snapshot.state) {
  //         case 'paused':
  //           console.log('Upload is paused');
  //           break;
  //         case 'running':
  //           console.log('Upload is running');
  //           break;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error uploading image:', error);
  //       // Handle error
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setMedia(downloadURL);
  //       });
  //     }
  //   );
  // };

  const slugify = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    //e.g transforms Chuks Dev to chuks-dev
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // if (file) {
      //   await handleImageUpload();
      // }

      const res = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          slug: slugify(title), //title.toLowerCase().replace(/\s+/g, '-'), // slugify title
          catSlug: catSlug || 'style', //If not selected, choose the general category
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        router.push(`/posts/${data.slug}`);
        setLoading(false);
      } else {
        console.log('Error Updaing Post. Please try again');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setLoading(false);
      // Handle error
    }
  };

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/');
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label
        htmlFor="category"
        style={{ marginBottom: '10px', paddingLeft: '50px' }}
      >
        Select a category
      </label>
      <select
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
        id="category"
      >
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="plus icon" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <label htmlFor="image" className={styles.addButton}>
              <Image src="/image.png" alt="image icon" width={16} height={16} />
            </label>
            <button className={styles.addButton}>
              <Image
                src="/external.png"
                alt="external icon"
                width={16}
                height={16}
              />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="video icon" width={16} height={16} />
            </button>
          </div>
        )}

        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
          //when we inspect this element in our browser, we can find css classes attached to it which we can edit in our global.css file
        />
      </div>
      {previewURL && (
        <Image src={previewURL} alt="preview" width={400} height={400} />
      )}
      <button
        className={styles.publish}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Publishing' : 'Publish'}
      </button>
    </div>
  );
};

export default WritePage;
