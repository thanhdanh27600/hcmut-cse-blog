import { PortableText } from '@portabletext/react'
import { getImageDimensions } from '@sanity/asset-utils'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FormEvent, FormEventHandler, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
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
      <li className="ml-4 list-disc">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="ml-4 list-decimal">{children}</li>
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const comment = event.currentTarget.firstChild?.nodeValue
    if (!comment) return

    const parent = null

    const data = {
      post: post._id,
      comment: comment,
      parent: parent,
    }

    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
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

      <article className="mx-auto my-10 max-w-3xl">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
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
        <div className="mt-10 mb-48">
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
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-sky-400 focus:ring"
            rows={8}
          />
        </label>
        <input
          type="submit"
          className="cursor-pointer rounded bg-sky-500 py-2 px-4 font-bold text-white shadow hover:bg-sky-400 focus:shadow-sm focus:outline-none"
        ></input>
      </form>

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

  const posts: [Post] = await sanityClient.fetch(query)

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
mainImage,
description,
body,
publishedAt
}`

  const post = await sanityClient.fetch(query, {
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
