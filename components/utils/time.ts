import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
export const timeAgo = new TimeAgo('en-US')
