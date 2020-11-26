import express from 'express';
import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';


const app = express()
const port = process.env.PORT || 3030
const secret = process.env.SECRET || 'assdd'

const digest = (body, secret) => {
    const sig = hmacSHA256(body, secret);
    return Base64.stringify(sig);
}


app.post('/', (req, res) => {
    const identifoDigest = req.headers.Digest || ''
    const signature = identifoDigest.substr('SHA-256='.length)
    const expectedSignature = digest(req.body, secret)
    console.log('Expected signature:', expectedSignature)
    console.log('Got signature:', signature)
    if (signature.localeCompare(expectedSignature)) {
        res.json({test: `passed`})
    }  else {
        res.status(403).send("Request digest signature is invalid.");
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



