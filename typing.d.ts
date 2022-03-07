export interface Post {
  _id: string
  author: Author
  body: Body[]
  description: string
  mainImage: MainImage
  slug: Slug
  title: string
  publishedAt: string
}

export interface Author {
  image: Image
  name: string
}

export interface Image {
  _type: string
  asset: Asset
  crop: Crop
  hotspot: Hotspot
}

export interface Asset {
  _ref: string
  _type: string
}

export interface Crop {
  _type: string
  bottom: number
  left: number
  right: number
  top: number
}

export interface Hotspot {
  _type: string
  height: number
  width: number
  x: number
  y: number
}

export interface Body {
  _key: string
  _type: BodyType
  children: Child[]
  markDefs: any[]
  style: Style
  level?: number
  listItem?: ListItem
}

export enum BodyType {
  Block = 'block',
}

export interface Child {
  _key: string
  _type: ChildType
  marks: Mark[]
  text: string
}

export enum ChildType {
  Span = 'span',
}

export enum Mark {
  Strong = 'strong',
}

export enum ListItem {
  Bullet = 'bullet',
}

export enum Style {
  H1 = 'h1',
  Normal = 'normal',
}

export interface MainImage {
  _type: string
  asset: Asset
}

export interface Slug {
  _type: string
  current: string
}
export interface User {
  googleId: string
  imageUrl: string
  email: string
  name: string
  givenName: string
  familyName: string
}

