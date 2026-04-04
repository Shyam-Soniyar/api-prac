import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ImageFullscreen from './components/imageFullscreen';

const RouteComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={<App />}
        />
        <Route
          path=":id"
          element={<ImageFullscreen />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;