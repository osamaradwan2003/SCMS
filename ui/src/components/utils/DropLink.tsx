import {Link, LinkProps} from "react-router-dom";

export function DropLink(props: LinkProps) {
	return (
		<>
			<Link className="flex gap-2 items-center" {...props}>
				{props.children}
			</Link>
		</>
	)
}