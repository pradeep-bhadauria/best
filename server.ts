import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as compression from 'compression';

import {join} from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
app.use(compression());

const redirectowww = true;
const redirectohttps = false;
const wwwredirecto = false;
app.use((req, res, next) => {
  // for domain/index.html
  if (req.url == '/index.html') {
    res.redirect(301, 'http://' + req.hostname);
  }

  // check if it is a secure (https) request
  // if not redirect to the equivalent https url
  if (redirectohttps && req.headers['x-forwarded-proto'] != 'http') {
    // special for robots.txt
    if (req.url == '/robots.txt') {
      next();
      return;
    }
    res.redirect(301, 'http://' + req.hostname + req.url);
  }

  // www or not
  if (redirectowww && !req.hostname.startsWith('www.')) {
    res.redirect(301, 'http://www.' + req.hostname + req.url);
  }

  // www or not
  if (wwwredirecto && req.hostname.startsWith('www.')) {
    const host = req.hostname.slice(4, req.hostname.length);
    res.redirect(301, 'http://' + host + req.url);
  }
  next();
}
);

app.route('/robot.txt')
  .get((req, res) => {
    res.sendFile(join(DIST_FOLDER, 'robot.txt'));
  });

app.route('/sitemap.xml')
  .get((req, res) => {
    var exec = require('child_process').exec;
    var command = 'curl "https://ws.behindstories.com/sitemap.xml"'
    var child = exec(command, function(error, stdout, stderr){
      var fs = require('fs');
      fs.writeFile(join(DIST_FOLDER, 'sitemap.xml'), stdout, function(err) {
        //console.log("crawled new sites");
      });
    });
    //console.log("returning new sitemap.xml");
    res.sendFile(join(DIST_FOLDER, 'sitemap.xml'));
  });


const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
