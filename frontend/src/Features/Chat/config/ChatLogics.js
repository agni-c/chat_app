export const getSenderName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}

export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0]
}

export const isSameSender = (messages, currMessage, messageIndex, userId) => {
  return (
		messageIndex < messages.length - 1 && // if not last message
		// if next message from different sender or next message  not undefined
		(messages[messageIndex + 1].sender._id !== currMessage.sender._id ||
			messages[messageIndex + 1].sender._id !== undefined) &&
		// if not current user
		messages[messageIndex].sender._id !== userId
  )
}
export const isLastMessage = (messages, messageIndex, userId) => {
  return (
		messageIndex < messages.length - 1 && // if not last message
		messages[messages.length - 1].sender._id !== userId && // if next message not from current user
		messages[messages.length - 1].sender._id
  )
}
