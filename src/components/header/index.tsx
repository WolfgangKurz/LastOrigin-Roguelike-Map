import { FunctionalComponent } from "preact";
import { Link } from "preact-router";

import style from "./style.scss";

interface LinkData {
	href: string;
	text?: string;
}

const NavItem: FunctionalComponent<LinkData> = (props) => (
	<li class={ `${style["nav-item"]} nav-item` }>
		<Link href={ props.href } class="nav-link" activeClassName="active">
			{ props.children || props.text }
		</Link>
	</li>
);

const Header: FunctionalComponent = () => <nav class={ `${style.navbar} navbar navbar-expand-sm navbar-dark bg-dark px-3` }>
	<div class="container-fluid">
		<div class={ `${style["navbar-brand"]} navbar-brand` }>
			<img src="/assets/icon.png" />
			<span>철의 탑 지도<br />멸망 전의 전술 교본</span>
		</div>

		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
			<span class="navbar-toggler-icon" />
		</button>

		<div class="collapse navbar-collapse" id="navbarCollapse">
			<ul class={ `${style["navbar-nav"]} navbar-nav me-auto mb-2 mb-lg-0` }>
				<NavItem href="/" text="홈" />
				<NavItem href="/list" text="전체 목록" />
				<NavItem href="/search" text="조각으로 찾기" />
			</ul>
		</div>
	</div>
</nav>;

export default Header;
