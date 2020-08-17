module.exports = checkAuth0 = (req, res, next) => {
    let ips = ['::ffff:192.168.0.8','::ffff:138.91.154.99', '::ffff:54.183.64.135', '::ffff:54.67.77.38', '::ffff:54.67.15.170', '::ffff:54.183.204.205', '::ffff:54.173.21.107', '::ffff:54.85.173.28', '::ffff:35.167.74.121', '::ffff:167.74.121', '::ffff:35.160.3.103', '::ffff:35.166.202.113', '::ffff:52.14.40.253', '::ffff:52.14.38.78', '::ffff:52.14.17.114', '::ffff:52.71.209.77', '::ffff:34.195.142.251', '::ffff:52.200.94.42']
    
    if(req.body['auth0-extension-secret'] === "2689b64f0e22e65016a305590bfdbc6a330fa2cc0c19677c55d7fa8bebf42122" && checkIP(ips, req.ip)) {
        next();
        return;
    }
    res.status(401).send({error: "Wrong secret"})
}

function checkIP(ips, ip) {
    for(let i = 0; i < ips.length; i++) {
        if(ip == ips[i]) {
            return true;
        }
    }
    return false;
}