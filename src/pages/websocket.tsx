import { createSignal, onCleanup } from 'solid-js'

export const WebSocketPage = () => {
	const [messages, setMessages] = createSignal([])
	const [inputMessage, setInputMessage] = createSignal('')
	let socket

	const connectWebSocket = () => {
		socket = new WebSocket('ws://localhost:3001/ws')

		socket.onopen = () => {
			console.log('WebSocket connection opened')
			setMessages((prev) => [...prev, 'Connected to server'])
		}

		socket.onmessage = (event) => {
			console.log('Message from server:', event.data)
			setMessages((prev) => [...prev, `Server: ${event.data}`])
		}

		socket.onclose = () => {
			console.log('WebSocket connection closed')
			setMessages((prev) => [...prev, 'Disconnected from server'])
		}
	}

	const sendMessage = () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(inputMessage())
			setMessages((prev) => [...prev, `You: ${inputMessage()}`])
			setInputMessage('')
		}
	}

	connectWebSocket()

	onCleanup(() => {
		if (socket) {
			socket.close()
		}
	})

	return (
		<div>
			<h1>WebSocket Test</h1>
			<div>
				{messages().map((msg, index) => (
					<p key={index}>{msg}</p>
				))}
			</div>
			<input
				type="text"
				value={inputMessage()}
				onInput={(e) => setInputMessage(e.target.value)}
			/>
			<button onClick={sendMessage}>Send</button>
		</div>
	)
}
