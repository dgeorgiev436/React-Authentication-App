import {useRef, useContext} from "react"
import AuthContext from "../../store/auth-context"
import {useHistory} from "react-router-dom"

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
	const history = useHistory()
	const authCtx = useContext(AuthContext)
	const newPasswordInputRef = useRef();
	
	const submitHandler = (event) => {
		event.preventDefault();
		
		const enteredNewPassword = newPasswordInputRef.current.value
		
		fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAAfaFuanyOQ8hc1KdikL02qRntrVrsKXc", {
			method: "POST",
			body: JSON.stringify({
				idToken: authCtx.token,
				password: enteredNewPassword,
				returnSecureToken: true
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(res => {
// 			assumption: Always succeeds
			
			history.replace("/ ")
		})
	}
	
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input minLength="7" ref={newPasswordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
