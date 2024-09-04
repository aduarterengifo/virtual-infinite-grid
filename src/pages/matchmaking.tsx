import { createSignal, onCleanup } from 'solid-js'

type Player = {
	id: string
	name: string
}

export const MatchmakingPage = () => {
	const [playerName, setPlayerName] = createSignal('')
	const [queue, setQueue] = createSignal<Player[]>([])
	const [isInQueue, setIsInQueue] = createSignal(false)
	let socket: WebSocket

	const connectWebSocket = () => {
		socket = new WebSocket('ws://localhost:3001/ws')

		socket.onopen = () => {
			console.log('Connected to matchmaking server')
			socket.send(JSON.stringify({ type: 'subscribe', topic: 'matchmaking' }))
		}

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data)
			console.log('data', data)
			if (data.type === 'queue_update') {
				setQueue(data.queue)
			}
		}

		socket.onclose = () => {
			console.log('Disconnected from matchmaking server')
		}
	}

	const joinQueue = () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ type: 'join_queue', name: playerName() }))
			setIsInQueue(true)
		}
	}

	const leaveQueue = () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ type: 'leave_queue' }))
			setIsInQueue(false)
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
			<h1>Matchmaking Queue</h1>
			<div>
				<input
					type="text"
					value={playerName()}
					onInput={(e) => setPlayerName(e.currentTarget.value)}
					placeholder="Enter your name"
				/>
				{isInQueue() ? (
					<button type="button" onClick={leaveQueue}>
						Leave Queue
					</button>
				) : (
					<button type="button" onClick={joinQueue}>
						Join Queue
					</button>
				)}
			</div>
			<div>
				<h2>Players in Queue:</h2>
				<ul>
					{queue().map((player) => (
						<li key={player.id}>{player.name}</li>
					))}
				</ul>
			</div>
		</div>
	)
}
