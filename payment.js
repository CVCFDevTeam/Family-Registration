var stripe = require('stripe');

module.exports = function (ctx, req, res) {
    stripe(ctx.secrets.stripeSecretKey).charges.create({
        amount: 214,
        currency: 'usd',
        source: ctx.body.stripeToken,
        description: 'Test Payment'
    }, function (error, charge) {
        var status = error ? 400 : 200;
        var message = error ? error.message : 'Thanks for your payment!'; 
        res.writeHead(status, { 'Content-Type': 'text/html' });
        return res.end('<h1>' + message + '</h1>');
    });
};