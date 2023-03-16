import useRouterElements from './useRouterElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const routerElements = useRouterElements()
  return (
    <div>
      {routerElements}
      <ToastContainer />
    </div>
  )
}

export default App
