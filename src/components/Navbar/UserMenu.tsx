import Dropdown from "../Dropdown";

interface UserMenuUser {
	login: string;
	avatar_url: string;
}

interface UserMenuProps {
	user: UserMenuUser;
	isOpen: boolean;
	onClose: () => void;
	onToggleOpen: () => void;
	onLogout: () => void;
}

export default function UserMenu({
	user,
	isOpen,
	onClose,
	onToggleOpen,
	onLogout,
}: UserMenuProps) {
	return (
		<Dropdown
			isOpen={isOpen}
			onClose={onClose}
			trigger={
				<button
					onClick={onToggleOpen}
					className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
				>
					<img
						src={user.avatar_url}
						alt={user.login}
						className="w-8 h-8 rounded-full"
					/>
				</button>
			}
			panelClassName="w-full sm:w-48 bg-white rounded-md shadow-md py-1 border border-gray-200"
		>
			<div className="px-4 py-2 pb-3 text-xs text-gray-700 border-b border-gray-200">
				Logged in as {user.login}
			</div>
			<a
				href={`https://gist.github.com/${user.login}`}
				target="_blank"
				rel="noopener noreferrer"
				className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
			>
				Your gists
			</a>
			<a
				href={`https://github.com/${user.login}`}
				target="_blank"
				rel="noopener noreferrer"
				className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
			>
				Your GitHub profile
			</a>
			<button
				onClick={() => {
					onClose();
					onLogout();
				}}
				className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
			>
				Logout
			</button>
		</Dropdown>
	);
}
