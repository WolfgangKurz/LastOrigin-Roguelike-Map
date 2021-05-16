import { FunctionalComponent } from "preact";
import { Link } from "preact-router";

import style from "./style.scss";

const Notfound: FunctionalComponent = () => <div class={ style.notfound }>
	<h1>Error 404</h1>
	<p>That page doesn&apos;t exist.</p>
	<Link href="/">
		<h4>Back to Home</h4>
	</Link>
</div>;

export default Notfound;
