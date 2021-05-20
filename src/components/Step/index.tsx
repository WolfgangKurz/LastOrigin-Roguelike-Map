import { FunctionalComponent } from "preact";

import style from "./style.scss";

interface StepProps {
	class?: string;

	list: string[];
	current: number;
	error?: boolean;
}

const Step: FunctionalComponent<StepProps> = (props) => {
	const gridStyle = {
		"grid-auto-columns": new Array(props.list.length)
			.fill("auto")
			.join(" 1fr "),
	};

	return <div class={ `${style.Step} ${props.class || ""}` } style={ gridStyle }>
		{ props.list.map((x, i) => {
			const cls = [
				props.error ? style.StepError : "",
				props.current === i ? style.StepCurrent : "",
				props.current > i ? style.StepSuccess : "",
			].filter(y => y).join(" ");

			return <>
				{ i > 0
					? <div class={ `${style.StepLine} ${cls}` } />
					: <></>
				}
				<div class={ `${style.StepItem} ${cls}` }>
					<div class={ style.StepIcon }>{ i + 1 }</div>
					<div class={ style.StepText }>{ x }</div>
				</div>
			</>;
		}) }
	</div>;
};
export default Step;
