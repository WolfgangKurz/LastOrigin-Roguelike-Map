import { FunctionalComponent } from "preact";
import { Route, Router } from "preact-router";

import Header from "./header";

import Home from "@/routes/Home";
import MapList from "@/routes/MapList";
import Search from "@/routes/Search";
import NotFoundPage from "@/routes/NotFound";

const App: FunctionalComponent = () => <div id="root">
	<link href="/assets/font/SpoqaHanSans-kr.css" rel="stylesheet" />

	<Header />
	<div class="main-content">
		<Router>
			<Route path="/" component={ Home } />
			<Route path="/list/:floorId?/:mapId?" component={ MapList } />
			<Route path="/search" component={ Search } />
			<NotFoundPage default />
		</Router>
	</div>
</div>;

export default App;
