import  {Navigate} from 'react-router'

const PrivateRoute = ({children, currentUser}) => {
    return currentUser ? children : <Navigate to="/login" replace />
}

export default PrivateRoute;