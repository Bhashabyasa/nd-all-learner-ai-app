import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/configureStore'; // Import the store correctly
import App from './App'; // Import your App component

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
