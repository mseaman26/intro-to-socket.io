import {jwtDecode} from 'jwt-decode';

class AuthService {
  getProfile() {
    if (!this.getToken()) {
      return null;
    }
    return jwtDecode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    console.log('token inside isTokenExpired:', token);
    // Decode the token to get its expiration time that was set by the server
    const decoded = jwtDecode(token);
    // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      return true;
    }
    // If token hasn't passed its expiration time, return `false`
    //console log formatted date and time of token expiration
    console.log('decoded token:', decoded);
    console.log('token expiration time:', new Date(decoded.exp * 1000).toLocaleString());
    console.log('token not expired inside isTokenExpired');
    return false;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.reload();
  }
}

export default new AuthService();
