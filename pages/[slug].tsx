import { PortableText } from '@portabletext/react'
import { getImageDimensions, isObject } from '@sanity/asset-utils'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FormEvent, FormEventHandler, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import CommentSection from '../components/CommentSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { client, urlFor } from '../sanity'
import { Post, User } from '../typing'

const ImageComponent = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value)
  return (
    <img
      src={urlFor()
        .image(value)
        .width(isInline ? 100 : 500)
        .fit('max')
        .auto('format')
        .url()}
      alt={value.alt || ' '}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? 'inline-block' : 'block',
        margin: '0 auto',
      }}
    />
  )
}

const components = {
  types: {
    code: ({ value }: any) => {
      return (
        <SyntaxHighlighter language={value.language} style={atomOneDark}>
          {value.code}
        </SyntaxHighlighter>
      )
    },
    image: ImageComponent,
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="ml-10 list-disc">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="ml-10 list-decimal">{children}</li>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="my-5 text-2xl font-bold">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h1 className="my-5 text-xl font-bold">{children}</h1>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-500 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}
interface Props {
  post: Post
}

export default function PostPage({ post }: Props) {
  const [user, setUser] = useState<User>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const commentEle = event.currentTarget.querySelector('.my-comment') as any

    if (!commentEle || !user) return

    const data = {
      post: post._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      comment: commentEle.value,
      parent: undefined,
    }

    const { comment, parent, name, email, imageUrl } = data

    setLoading(true)
    event.currentTarget.reset()

    try {
      const res = await client.create({
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: post._id,
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
      if (res) {
        window.alert('Th??nh c??ng. C??u h???i s??? ???????c hi???n th??? sau khi duy???t')
        setLoading(false)
      }
      // console.log(res)
    } catch (err) {
      console.log('ERROR:', err)

      setLoading(false)
    }
  }

  return (
    <main>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} setUser={setUser} error={error} setError={setError} />

      <img
        className="h-64 w-full object-contain"
        src={urlFor(post.mainImage).toString()}
        alt={post.description}
      />

      <article className="mx-auto my-10 max-w-3xl px-5">
        <h1 className="mt-10 mb-3 text-4xl font-bold">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).toString()}
            alt={post.description}
          />
          <p className="text-sm font-extralight">
            Post by <span className="text-sky-500">{post.author.name}</span> -
            Published at {new Date(post.publishedAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10 mb-10">
          {/* <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            components={{
              types: {
                code: CodeComponent,
                // Any other custom types you have in your content
                // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
              },
            }}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              code: ({ language, code }: any) => (
                <SyntaxHighlighter language={language}>
                  {code}
                </SyntaxHighlighter>
              ),
            }}
          /> */}

          <PortableText value={post.body} components={components} />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-lg border border-sky-300" />

      <form
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        onSubmit={onSubmit}
      >
        <h3 className="text-sm text-sky-500">
          Any question about this article
        </h3>
        <h4 className="font-bol text-3xl">Leave your comment here</h4>

        <hr className="mt-2 py-3" />

        <label className="mb-5 block">
          <span className="text-gray-500">Comment</span>
          <textarea
            className="my-comment form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-sky-400 focus:ring"
            rows={8}
            disabled={!isObject(user) || loading}
            placeholder={
              isObject(user)
                ? 'Enter your comment'
                : 'Please log-in to continue'
            }
          />
        </label>
        <input
          type="submit"
          className="cursor-pointer rounded bg-sky-500 py-2 px-4 font-bold text-white shadow hover:bg-sky-400 focus:shadow-sm focus:outline-none disabled:cursor-auto disabled:bg-gray-300"
          disabled={!isObject(user) || loading}
        ></input>
      </form>

      <CommentSection comments={post.comments} user={user} postId={post._id} />

      <Footer />
    </main>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
  _id,
  slug{
    current
  },
  }`

  const posts: [Post] = await client.fetch(query)

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type=="post" && slug.current==$slug][0]{
  _id,
  title,
  slug,
  author->{
  name,
  image
},
'comments': *[
  _type=="comment" && 
  post._ref == ^._id &&
  approved==true
],
mainImage,
description,
body,
publishedAt
}`

  const post = await client.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60seconds, it'll update the old cached version
  }
}
