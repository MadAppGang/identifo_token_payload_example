import express from 'express';
import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import bodyParser from 'body-parser';


const port = process.env.PORT || 3030
const secret = process.env.SECRET || 'dRHYfeXcdNmDmdOI3TWwT4RN'

const digest = (body, secret) => {
    const sig = hmacSHA256(body, secret);
    return sig.toString()
}

const app = express()
const options = {inflate: true, type: ['application/json', 'text/html']};

app.use(bodyParser.raw(options));
app.use(function (req, res, next) {
    const identifoDigest = req.headers.digest || ''
    const signature = identifoDigest.substr('SHA-256='.length)
    const expectedSignature = digest(req.body.toString(), secret)

    if (signature === expectedSignature) {  
        next()      
    } else {
        res.status(403).send("Request digest signature is invalid.");
    }    
})

app.post('/', (req, res) => {
    const j = JSON.parse(req.body.toString())
    if (j.user_id === 'abcdef') {
        res.json({test: `passed for special user absdef`})
    } else {
        res.json({test: `passed`})
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



