import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Row, Col, Button } from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import classNames from 'classnames'

//components
import { CustomCardPortlet, FormInput } from '@/components'

// images
import profilePic from '@/assets/images/users/avatar-1.jpg'

/* Chat Item Avatar */
const ChatItemAvatar = ({
	userAvatar,
	postedOn,
}: {
	userAvatar: string
	postedOn: string
}) => {
	return (
		<>
			<div className="chat-avatar">
				<img src={userAvatar} alt={userAvatar} />
				<i>{postedOn}</i>
			</div>
		</>
	)
}

/* Chat Item Text */
const ChatItemText = ({
	userName,
	text,
}: {
	userName: string
	text: string
}) => {
	return (
		<>
			<div className="conversation-text">
				<div className="ctext-wrap">
					<i>{userName}</i>
					<p>{text}</p>
				</div>
			</div>
		</>
	)
}

/* Chat Item */
const chatItemDefaultProps = {
	placement: '',
	children: PropTypes.object,
	className: '',
}

const ChatItem = ({
	children,
	placement,
	className,
}: {
	children: any
	placement: string
	className: string
}) => {
	return (
		<li
			className={classNames(
				'clearfix',
				{ odd: placement === 'left' },
				className
			)}
		>
			{children}
		</li>
	)
}

ChatItem.defaultProps = chatItemDefaultProps

/**
 * ChatForm
 */

interface FormValues {
	newMessage: string
}

/**
 * Renders the ChatForm
 */
const ChatForm = ({
	onNewMessagesPosted,
}: {
	onNewMessagesPosted: (message: string) => void
}) => {
	/*
	 * form validation schema
	 */
	const schemaResolver = yupResolver(
		yup.object().shape({
			newMessage: yup.string().required('Please enter your messsage'),
		})
	)

	const methods = useForm<FormValues>({ resolver: schemaResolver })
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
		reset,
	} = methods

	/**
	 * Handle valid form submission
	 */
	const handleValidMessageSubmit: SubmitHandler<FormValues> = (values) => {
		const message = values['newMessage']
		onNewMessagesPosted(message)
		reset()
	}

	return (
		<>
			<form
				name="chat-form"
				id="chat-form"
				onSubmit={handleSubmit(handleValidMessageSubmit)}
			>
				<Row>
					<Col>
						<FormInput
							type="text"
							name="newMessage"
							className="form-control chat-input"
							placeholder="Enter your text"
							register={register}
							key="newMessage"
							errors={errors}
							control={control}
						/>
					</Col>
					<Col className="col-auto">
						<Button
							type="submit"
							variant="danger"
							className="chat-send waves-effect waves-light"
						>
							Send
						</Button>
					</Col>
				</Row>
			</form>
		</>
	)
}

/**
 * ChatList
 */

interface MessageItem {
	id: number
	userPic?: string
	userName: string
	text: string
	postedOn: string
}

interface ChatListProps {
	className?: string
	messages: Array<MessageItem>
}

/**
 * Renders the ChatList
 */
const ChatList = (props: ChatListProps) => {
	const [messages, setMessages] = useState<Array<MessageItem>>(props.messages)

	/**
	 * Handle new message posted
	 */
	const handleNewMessagePosted = (message: string) => {
		// save new message
		setMessages(
			messages.concat({
				id: messages.length + 1,
				userPic: profilePic,
				userName: 'Thomson',
				text: message,
				postedOn: new Date().getHours() + ':' + new Date().getMinutes(),
			})
		)
	}

	return (
		<CustomCardPortlet cardTitle="Chat" titleClass="header-title">
			<div className="chat-conversation">
				{/* chat messages */}
				<SimpleBar style={{ maxHeight: '370px', width: '100%' }}>
					<ul className={`conversation-list ${props.className}`}>
						{(messages || []).map((message, i) => {
							return (
								<ChatItem
									key={i}
									placement={message.userName === 'Thomson' ? 'left' : 'right'}
								>
									{message.userPic && (
										<ChatItemAvatar
											userAvatar={message.userPic}
											postedOn={message.postedOn}
										/>
									)}
									<ChatItemText
										userName={message.userName}
										text={message.text}
									/>
								</ChatItem>
							)
						})}
					</ul>
				</SimpleBar>

				{/* chat form */}
				<ChatForm onNewMessagesPosted={handleNewMessagePosted} />
			</div>
		</CustomCardPortlet>
	)
}

export default ChatList
