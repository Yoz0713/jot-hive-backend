const checkEnvironment=(url)=>{
    const callBackURL = process.env.NODE_ENV == "production" ?`https://jot-hive-server.herokuapp.com${url}` :`http://localhost:3030${url}`;
    return callBackURL
}
const checkEnvironment2=(url)=>{
    const callBackURL = process.env.NODE_ENV == "production" ?`https://jothive.vercel.app${url}` :`http://localhost:3000${url}`;
    return callBackURL
}

module.exports = {
    server:checkEnvironment,
    client:checkEnvironment2
}