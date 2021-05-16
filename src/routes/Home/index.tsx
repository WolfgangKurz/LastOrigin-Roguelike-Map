import { FunctionalComponent } from "preact";

import style from "./style.scss";

const Home: FunctionalComponent = () => <div class="home">
	<img src="/assets/icon.png" />
	<h1>철의 탑 지도</h1>
	<h3>멸망 전의 전술 교본</h3>

	<div class="mt-5">
		본 사이트는 <a href="https://lo.swaytwig.com/" target="_blank" rel="noreferrer">멸망 전의 전술 교본</a>에서 제공하고 있습니다.
	</div>
</div>;

export default Home;
