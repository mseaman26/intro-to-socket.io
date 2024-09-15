import { useContext } from "react"
import { AuthContext } from '../utils/authContext.jsx'

const Home = () => {

    const { user } = useContext(AuthContext);
    console.log('user: ', user)

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
        </div>
    )
}

export default Home