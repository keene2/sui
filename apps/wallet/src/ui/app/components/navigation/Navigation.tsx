import { Link } from 'react-router-dom';

export function Navigation() {
	return (
		<nav>
			<Link to="/trading">
				<i className="bi bi-graph-up"></i>
				Trading
			</Link>
		</nav>
	);
}
