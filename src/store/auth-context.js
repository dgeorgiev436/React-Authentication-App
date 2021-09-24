import React, {useState, useEffect, useCallback} from "react"

let logoutTimer;

const AuthContext = React.createContext({
	token: "",
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {}
})

// automatic logout helper function
const calculateRemainingTime = (expirationTime) => {
	const currentTime = new Date().getTime();
	const adjustedExpirationTime = new Date(expirationTime).getTime();
	
	const remainingDuration = adjustedExpirationTime - currentTime;
	
	return remainingDuration
}

const retrieveStoreToken = () => {
	const storedToken = localStorage.getItem("token");
	const storedExpirationDate = localStorage.getItem("expirationTime")
	
	const remainingTime = calculateRemainingTime(storedExpirationDate)
// 	Don't log in if user session remains less than 1 minute
	if(remainingTime <= 60000){
		localStorage.removeItem("token")
		localStorage.removeItem("expirationTime")
		return null
	}
// 	return the token and left duration time
	return {
		token: storedToken,
		duration: remainingTime
	};
}

export const AuthContextProvider = (props) => {
	const tokenData = retrieveStoreToken()
	let initialToken;
	if(tokenData){
		initialToken = tokenData.token;
	}
	
	const [token, setToken] = useState(initialToken)
	
	const userIsLoggedIn = !!token;

	
	const logoutHandler = useCallback(() => {
		setToken(null)
// 		Clear localStorage if user logs out
		localStorage.removeItem("token")
		localStorage.removeItem("expirationTime")
// 		Clear timer if user logs out manually
		if(logoutTimer){
			clearTimeout(logoutTimer);
		}
	})

	const loginHandler = (token, expirationTime) => {
		setToken(token)
		localStorage.setItem("token", token);
		localStorage.setItem("expirationTime", expirationTime)
		
		const remainingTime = calculateRemainingTime(expirationTime);
// 		Automatic logout after given time
		logoutTimer = setTimeout(logoutHandler, remainingTime)
	}
	
	useEffect(() => {
		if(tokenData){
			console.log(tokenData.duration)
			logoutTimer = setTimeout(logoutHandler, tokenData.duration)
		}
		
	}, [tokenData, logoutHandler])
	
	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler
	}
	
	
	return(
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext;