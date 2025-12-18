import "./App.css";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./utils/useAuth";
function App() {
  const { loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
