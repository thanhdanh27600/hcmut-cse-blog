// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
}

const client = sanityClient(config)

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { post, comment, parent, name, email, imageUrl } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: post,
      },
      comment,
      name,
      imageUrl,
      email,
      parent: {
        _type: 'reference',
        _ref: parent || undefined,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Could not post the comment' })
  }

  res.status(200).json({ message: 'Comment submitted' })
}
