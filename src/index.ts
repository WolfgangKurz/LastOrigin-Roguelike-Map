import App from "./components/app";
import { Extend } from "./libs/Functions";

import "@/themes/index.scss";

if (typeof window !== "undefined") {
	const pageonloading = document.querySelector("#pageonloading");
	if (pageonloading) {
		const parent = pageonloading.parentNode;
		if (parent)
			parent.removeChild(pageonloading);
	}
}

Extend();

export default App;
