import { Route, Router } from '@solidjs/router'
import { render } from 'solid-js/web'

import './index.css'
import './standard.css'
import { Link, Meta, MetaProvider, Title } from '@solidjs/meta'
import type { ParentComponent } from 'solid-js'
import { lazy } from 'solid-js'

const MnKGame = lazy(() =>
	import('./m-n-k/m-n-k-game').then((module) => ({ default: module.MnKGame })),
)
const Convolution = lazy(() =>
	import('./pages/convolution/convolution').then((module) => ({
		default: module.Convolution,
	})),
)
const Grid3 = lazy(() =>
	import('./pages/infinite-grid-2/grid-3').then((module) => ({
		default: module.Grid3,
	})),
)
const MatchmakingPage = lazy(() =>
	import('./pages/matchmaking').then((module) => ({
		default: module.MatchmakingPage,
	})),
)
const NotFound = lazy(() =>
	import('./pages/not-found').then((module) => ({ default: module.NotFound })),
)
const WebSocketPage = lazy(() =>
	import('./pages/websocket').then((module) => ({
		default: module.WebSocketPage,
	})),
)
const TicTacToe = lazy(() =>
	import('./tic-tac-toe').then((module) => ({ default: module.TicTacToe })),
)

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
	)
}

const App: ParentComponent = (props) => (
	<MetaProvider>
		<div class="Home no-zoom">
			<Title>Infinite Grid</Title>
			<Link rel="canonical" href="http://solidjs.com/" />
			<Meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
			/>
			{props.children}
		</div>
	</MetaProvider>
)

const Routes = () => (
	<Router root={App}>
		<Route path="/tic-tac-toe" component={TicTacToe} />
		<Route path="/infinite-grid" component={Grid3} />
		<Route path="/m-n-k" component={MnKGame} />
		<Route path="/convolution" component={Convolution} />
		<Route path="/ws" component={WebSocketPage} />
		<Route path="/queue" component={MatchmakingPage} />
		<Route path="*paramName" component={NotFound} />
	</Router>
)

render(Routes, root!)
