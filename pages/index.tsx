import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post, User } from '../typing'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  const [user, setUser] = useState<User>()
  const [error, setError] = useState<any>()

  return (
    // <div className="flex min-h-screen flex-col items-center justify-center py-2">
    <div>
      <div className="mx-auto max-w-7xl">
        <Head>
          <title>CSE Blog</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
        </Head>

        <Header
          user={user}
          setUser={setUser}
          error={error}
          setError={setError}
        />

        <div className="flex items-center justify-between border-2 border-sky-700 bg-sky-300 py-10 lg:py-5 ">
          <div className="space-y-5 px-10">
            <h1 className="max-w-xl font-serif text-6xl">
              <span className="underline decoration-black decoration-4">
                CSE Blog
              </span>{' '}
              is a place to write, read and connect
            </h1>
            <h2
              className="line-clamp-3"
              title="The Department of Computer Engineering (DoCE) is one of the five
              departments of the Faculty of Computer Science and Technology,
              formerly the Department of Information Technology, Ho Chi Minh
              University of Technology – VNU – HCM. The department was founded
              with the establishment of the Department of Computer Science in
              1993. Through many ups and downs and developments, DoCE is
              currently gathering experienced lecturers graduated from advanced
              countries along with a team of excellent teaching assistants
              trained from the Ho Chi Minh University of Technology – VNU – HCM.
              DoCE is the department which has the main responsibility for the
              undergraduate Computer Engineering training program (one of the
              two ABET-qualified programs of Ho Chi Minh University of
              Technology – VNU – HCM, in addition to the Computer Science
              program of the same faculty)."
            >
              The Department of Computer Engineering (DoCE) is one of the five
              departments of the Faculty of Computer Science and Technology,
              formerly the Department of Information Technology, Ho Chi Minh
              University of Technology – VNU – HCM. The department was founded
              with the establishment of the Department of Computer Science in
              1993. Through many ups and downs and developments, DoCE is
              currently gathering experienced lecturers graduated from advanced
              countries along with a team of excellent teaching assistants
              trained from the Ho Chi Minh University of Technology – VNU – HCM.
              DoCE is the department which has the main responsibility for the
              undergraduate Computer Engineering training program (one of the
              two ABET-qualified programs of Ho Chi Minh University of
              Technology – VNU – HCM, in addition to the Computer Science
              program of the same faculty).
            </h2>
          </div>
          <img
            alt=""
            className="m-16 hidden w-32 md:inline-flex lg:h-full lg:w-64"
            src="/static/cse.png"
          />
        </div>
        {/* Post */}
        <div className="my-5 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/${post.slug.current}`}>
              <div
                className="group cursor-pointer overflow-hidden rounded-lg border"
                title={post.description}
              >
                <img
                  className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                  src={urlFor(post.mainImage).toString()}
                  alt={`${post.title}`}
                />
                <div className="flex justify-between bg-white px-5 pt-5">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                  </div>
                  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).toString()}
                    alt={`${post.title}`}
                  />
                </div>
                <p className="m-5 text-xs font-light text-gray-500 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
  _id,
  title,
  slug,
  author->{
  name,
  image
},
mainImage,
description
}`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
