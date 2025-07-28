// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const isLoggedIn = !!localStorage.getItem('userId');
//   return isLoggedIn ? children : <Navigate to="/" replace />;
// };

// export default PrivateRoute;

import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('userId');
    return isLoggedIn ? children : Navigate({ to: "/", replace: true });
};

export default PrivateRoute;
