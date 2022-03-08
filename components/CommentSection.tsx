import { MouseEventHandler } from 'react'
import { client } from '../sanity'
import { Comment, User } from '../typing'
import { timeAgo } from './utils/time'

interface CommentSection {
  user: User | undefined
  postId: string
  comments: Comment[]
}

const sortDate = (a: Comment, b: Comment) => {
  return -new Date(a._createdAt).getTime() + new Date(b._createdAt).getTime()
}

export default function CommentSection(commentSection: CommentSection) {
  async function handleReplySubmit(event: any) {
    const target = event.target.dataset.replySubmit
    const commentEle = event.target.previousSibling
    const comment = event.target.previousSibling.value
    const { name, email, imageUrl } = { ...commentSection.user }

    if (!comment) return
    try {
      const res = await client.create({
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: commentSection.postId,
        },
        name,
        comment,
        imageUrl,
        email,
        parent: {
          _type: 'reference',
          _ref: target,
        },
      })
      if (res) {
        // console.log(res)
        window.alert('Thành công. Câu trả lời sẽ được hiển thị sau khi duyệt')
      }
      // console.log(res)
    } catch (err) {
      console.log('ERROR in Reply:', err)
    }
    commentEle.value = ''
  }

  const handleReply: MouseEventHandler<HTMLButtonElement> = (event) => {
    const parentId = event.currentTarget.dataset.replybutton
    const replyWrapper = document.createElement('div')

    const replyArea = document.createElement('textarea')
    replyArea.placeholder = 'Your reply'
    replyArea.className =
      'm-2 p-2 shadow outline-none ring-sky-400 focus:ring w-full'
    replyArea.rows = 3
    replyArea.dataset['replyarea'] = parentId

    const replySubmit = document.createElement('button')
    replySubmit.className =
      'cursor-pointer rounded bg-sky-500 text-sm text-white shadow hover:bg-sky-400 focus:shadow-sm focus:outline-none disabled:cursor-auto disabled:bg-gray-300 w-16 h-6 ml-2'

    replySubmit.dataset['replySubmit'] = parentId
    replySubmit.textContent = 'Send'
    replySubmit.onclick = handleReplySubmit

    const lastChild = event.currentTarget.parentNode?.lastChild

    if (lastChild?.firstChild?.nodeName.toLowerCase() === 'textarea') {
      event.currentTarget.parentNode?.lastChild?.remove()
      return
    }
    replyWrapper.appendChild(replyArea)
    replyWrapper.appendChild(replySubmit)
    event.currentTarget.parentNode?.appendChild(replyWrapper)
  }

  return (
    <div className="mx-auto max-w-2xl">
      {commentSection.comments
        .sort(sortDate)
        .map((comment) => {
          if (!comment.parent?._ref) {
            return {
              parent: comment,
              reply: commentSection.comments
                .sort(sortDate)
                .filter((child_comment) => {
                  return child_comment.parent?._ref === comment._id
                }),
            }
          }
          return
        })
        .filter((r) => r)
        .map((comment) => {
          return (
            <div
              className="mb-8 flex"
              key={`comment-${comment?.parent._id}`}
              data-comment={comment?.parent._id}
            >
              <div className="m-5 min-w-max">
                <img
                  className="h-8 rounded-full"
                  src={comment?.parent.imageUrl}
                  alt={`avatar-${comment?.parent.imageUrl}`}
                />
              </div>
              <div className="flex w-full translate-y-4 flex-col justify-center">
                <div className="text-sm font-bold">
                  {comment?.parent.name}
                  <span className="ml-2 text-xs text-gray-500">
                    {timeAgo.format(
                      new Date(comment ? comment.parent._createdAt : '')
                    )}
                  </span>
                </div>
                <div className="max-w-xl">{comment?.parent.comment}</div>
                <button
                  className="mt-2 self-start text-xs text-gray-400"
                  data-replybutton={comment?.parent._id}
                  onClick={handleReply}
                >
                  REPLY
                </button>
                {comment?.reply.map((replyComment) => {
                  return (
                    <div
                      className="mb-3 flex"
                      key={`comment-${replyComment._id}`}
                      data-comment={replyComment._id}
                    >
                      <div className="m-2 min-w-max">
                        <img
                          className="h-8 rounded-full"
                          src={replyComment.imageUrl}
                          alt={`avatar-${replyComment.imageUrl}`}
                        />
                      </div>
                      <div className="flex w-full translate-y-4 flex-col justify-center">
                        <div className="text-sm font-bold">
                          {replyComment.name}
                          <span className="ml-2 text-xs text-gray-500">
                            {timeAgo.format(new Date(replyComment._createdAt))}
                          </span>
                        </div>
                        <div className="max-w-xl">{replyComment.comment}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
    </div>
  )
}
