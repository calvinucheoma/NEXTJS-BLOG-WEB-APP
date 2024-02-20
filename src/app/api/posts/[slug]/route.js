import { getAuthSession } from '@/utils/auth';
import prisma from '@/utils/connect';
import { NextResponse } from 'next/server';

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    // const post = await prisma.post.findUnique({
    //   where: { slug }, // same as writing it like this: where: {slug:slug}
    //   include: { user: true }, // because in our model, we had the user included in a post so we can do this
    // });
    const post = await prisma.post.update({
      where: { slug }, // same as writing it like this: where: {slug:slug}
      data: { views: { increment: 1 } }, //so whenever we visit this page, it updates the 'views' property
      include: { user: true }, // because in our model, we had the user included in a post so we can do this
    });
    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong' }, { status: 500 })
    );
  }
};

// EDIT POST
export const PATCH = async (req, { params }) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated' }, { status: 401 })
    );
  }

  const { slug } = params;

  try {
    const body = await req.json();

    const post = await prisma.post.findUnique({
      where: { slug },
      select: { userEmail: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: 'Post not found' }, { status: 404 })
      );
    }

    // Check if the current user is the owner of the post
    if (post.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }, { status: 401 })
      );
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        ...body,
      },
    });

    // console.log(updatedPost);

    return new NextResponse(JSON.stringify(updatedPost, { status: 200 }));
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong' }, { status: 500 })
    );
  }
};

// DELETE POST
export const DELETE = async (req, { params }) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Not Authenticated' }, { status: 401 })
    );
  }

  const { slug } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { userEmail: true },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({ message: 'Post not found' }, { status: 404 })
      );
    }

    // Check if the current user is the owner of the post
    if (post.userEmail !== session.user.email) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }, { status: 401 })
      );
    }

    // Delete comments associated with the post
    await prisma.comment.deleteMany({
      where: {
        post: {
          slug,
        },
      },
    });

    // Delete the post
    await prisma.post.delete({
      where: {
        slug,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Post deleted successfully' }, { status: 200 })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong' }, { status: 500 })
    );
  }
};
