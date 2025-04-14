import { NextResponse } from 'next/server'
import getProjects from '../../../firebase/firestore/getProjects'

export async function GET() {
  try {
    const cdata = await getProjects()
    return NextResponse.json({ data: data, status: 200 })
    // return NextResponse.json({ data: data.data, status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 401 }
    )
  }
}

const data = {
  data: [
    {
      id: 'a2ecWdNuKw7XhcUrMnNZ',
      data: {
        description: 'about project three',
        link: 'link three',
        image:
          'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
        title: 'project three',
        createdAt: 1729301778845,
      },
    },
    {
      id: 'q53GX7NjCewwFPj7iJCw',
      data: {
        description: 'about project two',
        link: 'link two',
        image:
          'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
        title: 'project two',
        createdAt: 1729292778845,
      },
    },
    {
      id: 'stcceoaC1URKdk8aK7v2',
      data: {
        description: 'about project one',
        link: 'link one',
        image:
          'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
        title: 'project one',
        createdAt: 1729291778845,
      },
    },
  ],
  status: 200,
}