import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import EditorPage from "./pages/EditorPage";
import "./index.css";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<EditorPage />} />
					<Route path="/@:username/:gistId" element={<EditorPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
