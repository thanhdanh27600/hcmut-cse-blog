import { Comment, User } from '../typing'
import { timeAgo } from './utils/time'

interface CommentSection {
  user: User | undefined
  comments: Comment[]
}

export default function CommentSection(commentSection: CommentSection) {
  console.log(commentSection)

  return (
    <div className="mx-auto max-w-2xl">
      {commentSection.comments.map((comment) => {
        return (
          <div
            className="mb-8 flex"
            key={`comment-${comment._id}`}
            data-comment={comment._id}
          >
            <div className="m-5 w-8">
              <img
                className="h-8 rounded-full"
                src={comment.imageUrl}
                alt={`avatar-${comment.imageUrl}`}
              />
            </div>
            <div className="flex translate-y-4 flex-col justify-center">
              <div className="text-sm font-bold">
                {comment.name}
                <span className="ml-2 text-xs text-gray-500">
                  {timeAgo.format(new Date(comment._createdAt))}
                </span>
              </div>
              <div className="max-w-xl">{comment.comment}</div>
              <div
                className="mt-2 cursor-pointer text-xs text-gray-400"
                data-reply={comment._id}
              >
                REPLY
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
