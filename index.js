user = null;

async function send_login_link(email){
    console.log("sending login link to " + email)
    return await fetch('https://85ryhdr1jd.execute-api.us-east-1.amazonaws.com/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
    });
}
async function is_logged_in(){
    if(user){
        return true;
    }else{
        user = await get_user();
        return user != null;
    }
}
async function logout(){
    document.cookie = 'buttonT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    user = null;
    window.location.href = 'index.html';
}

async function get_user(){
    let token = await get_login_token();
    if(token){
        let response = await fetch('/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authroization': 'Bearer ' + token
            }
        });
        let data = await response.json();
        if(data.error){
            return null;
        }
        let u = new User(data.email, data.integrations, data.id, data.subscribed);
        if(!u.subscribed){
            window.location.href = 'subscribe.html';
        }
        return u;
    }
    return null;
}

class User{
    constructor(email, integrations, id, subscribed){
        this.email = email;
        this.integrations = integrations;
        this.id = id;
        this.subscribed = subscribed;
    }
}

async function add_integration(integration){
    fetch('/add-integration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authroization': 'Bearer ' + await get_login_token()
        },
        body: JSON.stringify({integration: integration}),
    });
}

async function get_login_token(){
    //get the cookies
    let cookies = document.cookie;
    let cookieArray = cookies.split(';');
    let token = null;
    for(let i = 0; i < cookieArray.length; i++){
        let cookie = cookieArray[i];
        if(cookie.includes('buttonT')){
            token = cookie.split('=')[1];
        }
    }
    return token;
}