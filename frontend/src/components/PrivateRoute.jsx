import  {Navigate} from 'react-router'

const PrivateRoute = ({children, currentUser}) => {
    return currentUser ? children : <Navigate to="/" replace />
}

export default PrivateRoute;