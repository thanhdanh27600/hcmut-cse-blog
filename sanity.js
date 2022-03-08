import {
  createPreviewSubscriptionHook,
  createCurrentUserHook,
  createClient,
} from 'next-sanity'

import sanityClient from '@sanity/client'

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2022-03-08',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
}

export const client = sanityClient(config)

import createImageUrlBuilder from '@sanity/image-url'

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source) => createImageUrlBuilder(config).image(source)

export const useCurrentUser = createCurrentUserHook(config)
