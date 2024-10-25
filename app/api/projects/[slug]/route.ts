import { NextResponse } from 'next/server'
import getProject from '../../../../firebase/firestore/getProject'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const id: string = (await params).slug
   try {
     const data = await getProject(id)
     return NextResponse.json({ data: data, status: 200 })
   } catch (error) {
     console.error(error)
     return NextResponse.json(
       { error: 'Failed to fetch projects' },
       { status: 401 }
     )
   }
}